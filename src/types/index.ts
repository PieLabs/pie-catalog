import * as semver from 'semver';

export type KeyMap = { [key: string]: any }

export class PackageId {
  constructor(readonly name: string) { }
}

export class PieId {
  constructor(
    readonly org: string,
    readonly repo: string,
    readonly tag: string) { }

  static build(org: string, repo: string, tag: string) {
    let s = semver.valid(tag);
    if (s) {
      return new PieId(org, repo, s);
    }
  }
}