import { PieId } from '../../types';
import { Readable, Writable } from 'stream';
import * as express from 'express';

export { PieId }

export interface DemoService {
  upload(id: PieId, name: string, stream: Readable, done: (e?: Error) => void): void;
  delete(id: PieId): Promise<boolean>;
  deleteAll(org: string, repo: string): Promise<boolean>;
}

export interface DemoRouter {
  prefix(): string;
  router(): express.Router;
  getDemoLink(id: PieId): string;
}
