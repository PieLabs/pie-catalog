import { PieId, KeyMap } from '../types';
import { DemoService } from './demo/service';
export { PieId, KeyMap, DemoService }

export type ListOpts = { limit: number, skip: number };

export type ElementLite = { org: string, repo: string, description: string, tag: string }

export type Element = {
  org: string, repo: string, description: string, tag: string,
  readme: string, pkg: any, schemas: any[]
}

export interface ElementService {
  readonly demo: DemoService;
  reset(id: PieId): Promise<boolean>;
  saveSchema(id: PieId, name: string, schema: KeyMap): Promise<boolean>;
  saveReadme(id: PieId, readme: string): Promise<boolean>;
  savePkg(id: PieId, pkg: KeyMap): Promise<boolean>;
  list(opts: ListOpts): Promise<{ opts: ListOpts, count: number, elements: ElementLite[] }>;
  listByOrg(org: string, opts: ListOpts): Promise<{ opts: ListOpts, count: number, elements: ElementLite[] }>;

  load(org: string, repo: string): Promise<Element>;
}