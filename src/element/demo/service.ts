import { PieId } from '../../types';
import { Writable } from 'stream';
import * as express from 'express';

export { PieId }

export interface DemoService {
  stream(id: PieId, name: string): Writable;
  delete(id: PieId): Promise<boolean>;
  deleteAll(org:string, repo:string): Promise<boolean>;
}

export interface DemoRouter {
  prefix(): string;
  router(): express.Router;
  getDemoLink(id: PieId): string;
}
