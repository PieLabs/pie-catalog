import { PackageId } from '../../../types';
import { Readable, Writable } from 'stream';
import * as express from 'express';

export { PackageId }

export interface DemoService {
  upload(id: PackageId, name: string, stream: Readable): Promise<any>;
  delete(id: PackageId): Promise<boolean>;
  deleteAll(org: string, repo: string): Promise<boolean>;
  getDemoLink(id: PackageId): string;
  // configAndMarkup(id: PieId): Promise<{ config: any, markup: string }>
}

export interface DemoRouter {
  prefix(): string;
  router(): express.Router;
}
