import { PieId, DemoService as Api } from './service';
import { Readable, Writable } from 'stream';
import { dirname, join } from 'path';
import { buildLogger } from '../../log-factory';
import { config, S3 } from 'aws-sdk';
import * as bluebird from 'bluebird';
import * as _ from 'lodash';
import { statSync } from 'fs-extra';
import * as stream from 'stream';
import { lookup } from 'mime-types';
import { extname } from 'path';

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

export function hasConfiguredAwsCredentials() {

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
    // Prefix: prefix,
    // Delimiter: '/'
  };

  logger.debug('[emptyDir] params: ', params);

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

export default class S3DemoService implements Api {

  static async build(bucket: string, prefix: string = 'app/.demo-service'): Promise<S3DemoService> {

    let client = new S3();

    let exists = await bucketExists(client, bucket);

    if (!exists) {
      throw new Error('bucket: ' + bucket + ' doesnt exist');
    }

    return new S3DemoService(bucket, prefix, client);
  }

  private constructor(readonly bucket: string, readonly prefix: string, readonly client: S3) {

  }


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

  deleteAll(org: string, repo: string) {
    return this.withPromise(
      emptyDir.bind(this, this.client, this.bucket, `${this.prefix}/${org}/${repo}`)
    );
  }

  delete(id: PieId): Promise<boolean> {
    return this.withPromise(
      emptyDir.bind(this, this.client, this.bucket, this.getRoot(id))
    );
  }

  private getRoot(id: PieId) {
    return `${this.prefix}/${id.org}/${id.repo}/${id.tag}`;
  }

  private getKey(id: PieId, name: string) {
    return `${this.getRoot(id)}/${name}`
  }

  upload(id: PieId, name: string, stream: Readable, done: (e?: Error) => void): void {
    let params = {
      Bucket: this.bucket,
      Key: this.getKey(id, name),
      Body: stream,
      ContentType: lookup(extname(name))
    };

    this.client.upload(params, function (err, data) {
      logger.debug('[upload] err: ', err, 'data: ', data);
      done(err);
    });
  }

  getDemoLink(id: PieId): string {
    return `http://${this.bucket}.s3.amazon.com/${this.getRoot(id)}/docs/demo/example.html`;
  }

}

