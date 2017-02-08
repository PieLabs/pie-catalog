import { PieId, KeyMap } from '../../types';
import { DemoService } from './demo/service';
import { GithubService } from '../github';

export { GithubService, PieId, KeyMap, DemoService }

export type ListOpts = { limit: number, skip: number };

export type ElementLite = { org: string, repo: string, description: string, tag: string }

export type Element = {
  org: string,
  repo: string,
  description: string,
  tag: string,
  readme: string,
  pkg: any,
  schemas: any[],
  externals?: {
    js: string[],
    css: string[]
  },
  demo: {
    config: any,
    markup: string
  }
}

export type DeleteResult = {
  ok: boolean,
  statusCode?: number,
  error?: string
}

export interface ElementService {
  readonly demo: DemoService;
  reset(id: PieId): Promise<boolean>;
  saveSchema(id: PieId, name: string, schema: KeyMap): Promise<boolean>;
  saveReadme(id: PieId, readme: string): Promise<boolean>;
  saveExternals(id: PieId, externals: { js: string[], css: string[] }): Promise<boolean>;
  savePkg(id: PieId, pkg: KeyMap): Promise<boolean>;
  list(opts: ListOpts): Promise<{ opts: ListOpts, count: number, elements: ElementLite[] }>;
  listByOrg(org: string, opts: ListOpts): Promise<{ opts: ListOpts, count: number, elements: ElementLite[] }>;

  delete(org: string, repo: string): Promise<DeleteResult>;
  tag(org: string, repo: string): Promise<string>;
  load(org: string, repo: string): Promise<Element>;
}