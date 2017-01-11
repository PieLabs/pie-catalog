import { PieId, DemoService as Api, DemoRouter as Router } from './service';
import { Writable } from 'stream';
import { ensureDirSync, createWriteStream } from 'fs-extra';
import { dirname, join } from 'path';
import * as express from 'express';
import { buildLogger } from '../../log-factory';

const logger = buildLogger();

export default class DemoService implements Api, Router {

  constructor(readonly root: string) {

  }

  private toPath(id: PieId, name: string) {
    return `${id.org}/${id.repo}/${id.tag}/${name}`;
  }

  private getFilePath(id: PieId, name: string) {
    return join(this.root, this.toPath(id, name));
  }

  stream(id: PieId, name: string): Writable {
    logger.silly('[stream], id', id, name);
    let path = this.getFilePath(id, name);
    logger.silly('[stream] path: ', path);
    ensureDirSync(dirname(path));
    return createWriteStream(path);
  }

  prefix() {
    return '/demo';
  }

  getDemoLink(id: PieId): string {
    return `${this.prefix()}/${this.toPath(id, 'docs/demo/example.html')}`;
  }

  /** for the local file store return a static router that serves up the files. */
  router() {
    let r = express.Router();
    r.use(express.static(this.root));
    return r;
  }
}