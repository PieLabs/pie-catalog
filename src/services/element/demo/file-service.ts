import * as bluebird from 'bluebird';
import * as express from 'express';

import { DemoService as Api, PackageId, DemoRouter as Router } from './service';
import { Readable, Writable } from 'stream';
import { createReadStream, createWriteStream, ensureDirSync, readFile, readJson, remove, exists, existsSync } from 'fs-extra';
import { dirname, join } from 'path';

import { buildLogger } from 'log-factory';
import { replaceReact } from './utils';
const logger = buildLogger();

const readJsonAsync: (n: string, e: string) => bluebird<any> = bluebird.promisify(readJson);
const readFileAsync: (n: string, e: string) => bluebird<any> = bluebird.promisify(readFile);
const existsAsync: (n: string) => bluebird<any> = bluebird.promisify(exists);

const removePromise = (dir: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    remove(dir, e => {
      if (e) {
        reject(e);
      } else {
        resolve(dir);
      }
    })
  });
}

export default class DemoService implements Api, Router {

  constructor(readonly root: string) {
    logger.silly('demo-service');
    logger.info('demo-service');
  }

  private repoRoot(id: PackageId): string {
    return id.name;
  }

  private toPath(id: PackageId, name: string) {
    return `${this.repoRoot(id)}/${name}`;
  }

  private getFilePath(id: PackageId, name: string) {
    return join(this.root, this.toPath(id, name));
  }

  async deleteAll(org: string, repo: string): Promise<boolean> {
    logger.debug('[deleteAll], org: ', org, 'repo: ', repo);
    let dir = join(this.root, `${org}/${repo}`);
    let result = await removePromise(dir);
    return true;
  }

  async delete(id: PackageId): Promise<boolean> {
    logger.debug('[delete], id: ', id);
    let dir = join(this.root, this.repoRoot(id));
    let result = await removePromise(dir);
    return true;
  }

  upload(id: PackageId, name: string, stream: Readable): Promise<any> {
    return new Promise((resolve, reject) => {
      logger.silly('[upload], id', id, name);
      let path = this.getFilePath(id, name);
      logger.silly('[upload] path: ', path);
      ensureDirSync(dirname(path));
      let ws = createWriteStream(path);
      ws.on('error', (e) => {
        logger.error('error writing the file: ', e);
        reject(e);
      });
      ws.on('close', () => {
        logger.info(`[upload] uploaded to: ${path}, ${existsSync(path)}`)
        resolve();
      });
      stream.pipe(ws);
    });
  }

  prefix() {
    return '/demo';
  }

  getDemoLink(id: PackageId): string {
    return `${this.prefix()}/${this.toPath(id, 'example.html')}`;
  }

  /** for the local file store return a static router that serves up the files. */
  router() {
    let r = express.Router();

    r.get('/react.min.js', (req, res) => {
      let rs = createReadStream(join(__dirname, '../../../../lib/element/demo/react-w-tap-event.js'));
      rs.pipe(res);
    });

    /**
     * Note: We temporarily remove the cdn react and set our custom react here.
     * We may want to update the catalog app to use this custom react and so add it to the markup directly. 
     */
    r.get(/(.*)\/example\.html/, async (req, res) => {
      logger.debug('[GET example.html]', req.path);
      let markup = await readFileAsync(join(this.root, req.path), 'utf8');
      res.setHeader('Content-Type', 'text/html')
      res.send(replaceReact(markup, '/demo/react.min.js'));
    });

    r.use(express.static(this.root));
    return r;
  }
}