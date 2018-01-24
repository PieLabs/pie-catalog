import { KeyMap, PieId, PackageId } from '../../types';

import { DemoService } from './demo/service';
import { GithubService } from '../github';

export { GithubService, PieId, KeyMap, DemoService }

export type ListOpts = { limit: number, skip: number };

export type ElementLite = { name: string, description: string }

export type Element = {
  name: string,
  readme: string,
  pkg: any,
  schemas: any[],
  repository: {
    user: string,
    project: string,
    type: string
  }
  demo: {
    config: any,
    configureMap: { [key: string]: string },
    markup: string,
    externals: {
      css: string[],
      js: string[]

    }
  }
}

export type DeleteResult = {
  ok: boolean,
  statusCode?: number,
  error?: string
}

export interface ElementService {
  readonly demo: DemoService;
  saveBundle(id: PackageId, data: any): Promise<PackageId>;
  reset(id: PackageId): Promise<boolean>;
  listByRepoUser(user: string, opts: ListOpts): Promise<{ opts: ListOpts, count: number, elements: ElementLite[] }>;
  list(opts: ListOpts): Promise<{ opts: ListOpts, count: number, elements: ElementLite[] }>;
  delete(id: PackageId): Promise<DeleteResult>;
  load(id: PackageId): Promise<Element>;
}