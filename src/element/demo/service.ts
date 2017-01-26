import { PieId } from '../../types';
import { Readable, Writable } from 'stream';
import * as express from 'express';

export { PieId }

export interface DemoService {
  upload(id: PieId, name: string, stream: Readable): Promise<any>;
  delete(id: PieId): Promise<boolean>;
  deleteAll(org: string, repo: string): Promise<boolean>;
  getDemoLink(id: PieId): string;
}

export interface DemoRouter {
  prefix(): string;
  router(): express.Router;
}
