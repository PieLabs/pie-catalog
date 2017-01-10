import { Readable, Writable } from 'stream';
import PieId from '../../../types/pie-id';
import { createWriteStream, ensureDirSync } from 'fs-extra';
import { dirname, join } from 'path';
import { Demo } from '../../../services';
import * as express from 'express';

export interface DemoRouter {
  prefix(): string;
  router(): express.Router;
  getDemoLink(id: PieId): string;
}

export default class FileStore implements Demo, DemoRouter {

  constructor(readonly root: string) { }

  private getFilePath(id: PieId, name: string) {
    return join(this.root, `${id.org}/${id.repo}/${id.tag || id.sha}/${name}`);
  }

  save(id: PieId, name: string): Writable {
    let path = this.getFilePath(id, name);
    ensureDirSync(dirname(path));
    const fileStream = createWriteStream(path);
    return createWriteStream(path);
  }

  prefix() {
    return '/demo';
  }

  getDemoLink(id: PieId): string {
    return `${this.prefix()}/${id.org}/${id.repo}/${id.tag || id.sha}/docs/demo/example.html`;
  }

  /** for the local file store return a static router that serves up the files. */
  router() {
    let r = express.Router();
    r.use(express.static(this.root));
    return r;
  }
}