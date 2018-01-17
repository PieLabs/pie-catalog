import * as _ from 'lodash';
import * as bluebird from 'bluebird';
import * as stream from 'stream';

import { DemoService as Api, PackageId } from './service';
import { Readable, Writable } from 'stream';
import { S3, config } from 'aws-sdk';
import { dirname, join } from 'path';

import { buildLogger } from 'log-factory';
import { extname } from 'path';
import { lookup } from 'mime-types';
import { statSync } from 'fs-extra';

const logger = buildLogger();

//Init the region
config.update({ region: 'us-east-1' });

let params = (bucket): any => {
  return { Bucket: bucket };
}

let bucketExists = (s3, bucket) => {
  logger.debug('[bucketExists] bucket:', bucket);

  return new Promise((resolve, reject) => {
    s3.headBucket(params(bucket), (err) => {
      logger.silly('[headBucket] err: ', err);
      if (err) {
        resolve(false);
      } else {
        resolve(true);
      }
    });
  });
};

function hasSetAwsEnvVars(): boolean {
  return process.env.AWS_SECRET_ACCESS_KEY !== undefined && process.env.AWS_ACCESS_KEY_ID !== undefined;
}

function hasCredentials() {

  var homedir = process.env[(process.platform == 'win32') ? 'USERPROFILE' :
    'HOME'];

  function expandHomeDir(path) {
    if (!path) return path;
    if (path == '~') return homedir;
    if (path.slice(0, 2) != '~/') return path;
    return join(homedir, path.slice(2));
  }

  var credentialsFile = expandHomeDir('~/.aws/credentials');

  try {
    logger.debug('credentialsFile: ', credentialsFile);
    var stat = statSync(credentialsFile);
    return stat.isFile();
  } catch (e) {
    console.error(e);
    return false;
  }
};

function emptyDir(s3: AWS.S3, bucket, prefix, done) {

  prefix = _.endsWith(prefix, '/') ? prefix : `${prefix}/`;

  let params = {
    Bucket: bucket,
    Prefix: prefix
  };

  logger.silly('[emptyDir] params: ', params);

  s3.listObjectsV2(params, function (err, listData) {

    logger.debug('[emptyDir] listObjects: ', err, listData);

    if (err) {
      done(err);
      return;
    }

    if (listData.Contents.length === 0) {
      done();
      return;
    }

    let deleteParams: any = {
      Bucket: bucket,
      Delete: {
        Objects: listData.Contents.map((c) => ({ Key: c.Key }))
      }
    };

    logger.silly('[emptyDir] deleteParams: ', deleteParams);

    s3.deleteObjects(deleteParams, function (err, d) {
      if (err) {
        done(err);
        return;
      }

      if (listData.IsTruncated) {
        emptyDir(s3, bucket, prefix, done);
      } else {
        done();
      }
    });
  });
}

type Callback = (err?: Error) => void;
export const SERVICE_PREFIX = '.demo-service';

export default class S3DemoService implements Api {

  static async build(bucket: string, prefix: string = 'dev-app'): Promise<S3DemoService> {

    logger.info('[build] bucket: ', bucket, 'prefix: ', prefix);

    if (!hasCredentials() && !hasSetAwsEnvVars()) {
      throw new Error('You havent set any credentials for AWS');
    }

    let client = new S3();
    let exists = await bucketExists(client, bucket);

    if (!exists) {
      throw new Error('bucket: ' + bucket + ' doesnt exist - you need to create it.');
    }

    return new S3DemoService(bucket, prefix, client);
  }

  private constructor(readonly bucket: string, private prefix: string, readonly client: S3) { }

  private withPromise(fn: (Callback) => void): Promise<boolean> {
    return new Promise((resolve, reject) => {
      fn((err) => {
        logger.silly('[withPromise], err: ', err);
        if (err) {
          logger.error(err);
          resolve(false);
        } else {
          resolve(true);
        }
      });
    });
  }


  configAndMarkup(id: PackageId): Promise<{ config: any, markup: string }> {

    let markupRequest = this.client.getObject({ Bucket: this.bucket, Key: this.getKey(id, 'index.html') });
    let configRequest = this.client.getObject({ Bucket: this.bucket, Key: this.getKey(id, 'config.json') });

    return Promise.all([
      markupRequest.promise(),
      configRequest.promise()])
      .then(([m, c]) => {
        return { markup: m.Body.toString(), config: JSON.parse(c.Body.toString()) }
      });
  }

  deleteAll(org: string, repo: string) {
    return this.withPromise(
      emptyDir.bind(this, this.client, this.bucket, `${this.prefix}/${org}/${repo}`)
    );
  }

  delete(id: PackageId): Promise<boolean> {
    logger.debug('[delete] id: ', id);
    return this.withPromise(
      emptyDir.bind(this, this.client, this.bucket, this.getRoot(id))
    );
  }

  private idToPath(id: PackageId) {
    return id.name;
  }

  private getRoot(id: PackageId) {
    return `${this.servicePrefix}/${this.idToPath(id)}`
  }

  public get servicePrefix() {
    return `${this.prefix}/${SERVICE_PREFIX}`;
  }

  private getKey(id: PackageId, name: string) {
    return `${this.getRoot(id)}/${name}`
  }

  upload(id: PackageId, name: string, stream: Readable): Promise<any> {
    let params = {
      Bucket: this.bucket,
      Key: this.getKey(id, name),
      Body: stream,
      ContentType: lookup(extname(name))
    };

    logger.debug('[upload], id: ', id, 'name: ', name);
    return this.client.upload(params).promise();
  }

  //TODO - how do we set up cloudfront?
  getDemoLink(id: PackageId): string {
    return `/demo/${this.idToPath(id)}/example.html`;
  }

}

