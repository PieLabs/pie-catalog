import { PieId, DemoService as Api, DemoRouter as Router } from './service';
import { Writable } from 'stream';
import { readFileSync, createReadStream, ensureDirSync, createWriteStream } from 'fs-extra';
import { dirname, join } from 'path';
import * as express from 'express';
import { buildLogger } from '../../log-factory';

const logger = buildLogger();

export default class S3DemoService implements Api, Router {

  constructor(readonly bucket: string) {

  }

  stream(id: PieId, name: string): Writable {
    return null;
  }

  prefix(): string {
    return '?'
  }

  router(): express.Router {
    return null;
  }

  getDemoLink(id: PieId): string {
    return '?';
  }

}
