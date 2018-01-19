import * as _ from 'lodash';
import * as lodash from 'lodash';
import { escape as mongoEscape, unescape as mongoUnescape } from './mongo-escape';

import {
  ElementService as Api,
  DeleteResult,
  DemoService,
  Element,
  ElementLite,
  GithubService,
  KeyMap,
  ListOpts,
  PieId,
} from './service';

import { Collection } from 'mongodb';
import { buildLogger } from 'log-factory';
import { PackageId } from '../../types/index';

const logger = buildLogger();

let idToQuery = (id: PieId) => {
  return {
    org: id.org,
    repo: id.repo
  }
}

const liteFields = { name: 1, 'package.description': 1 };

const toKeyValueArray = (dependencies: KeyMap): { key: string, value: string }[] => _.map(dependencies, (value, key) => ({ value, key }));

const toKeyMap = (keyValues: { key: string, value: string }[]): KeyMap => _.reduce(keyValues, (acc, { key, value }) => {
  acc[key] = value;
  return acc;
}, {});

export default class ElementService implements Api {


  constructor(
    private collection: Collection,
    readonly demo: DemoService,
    readonly github: GithubService) {

    this.collection.createIndex({ name: 1 }, { unique: true })
      .then(() => logger.silly('name unique index created'));
  }

  async delete(id: PackageId): Promise<DeleteResult> {
    logger.debug(`[delete], name: ${id.name}`);

    let query = { name: id.name };
    let removeResult = await this.collection.findOneAndDelete(query);
    logger.silly('[delete] removeResult: ', removeResult);

    if (removeResult.ok && removeResult.value) {
      // let id = new PieId(org, repo, removeResult.value.tag);
      let demoDeleteResult = await this.demo.delete(id);
      if (demoDeleteResult) {
        return { ok: true }
      } else {
        return { ok: false, statusCode: 500, error: 'failed to delete the demo dir' }
      }
    } else {
      return { ok: false, statusCode: 500, error: 'failed to delete the repo' }
    }
  }

  private update(id: PieId, update) {
    update = _.merge(update, { $set: { tag: id.tag } });
    logger.info('update: ', update);
    return this.collection.update(idToQuery(id), update, { upsert: true })
      .then(r => {
        logger.info('[update]', r.result);
        return true;
      });
  }

  reset(id: PackageId) {
    //TODO - wipe schemas here? back up document?
    logger.warn('TODO: implement reset');
    return Promise.resolve(true);
  }

  saveBundle(id: PackageId, bundle: KeyMap): Promise<PackageId> {
    bundle.name = id.name;
    const escaped = mongoEscape(bundle);
    return this.collection.insertOne(escaped)
      .then(r => id)
      .catch(e => {
        logger.error('[saveBundle] failed: ', e.message);
        throw e;
      });
  }



  async load(id: PackageId) {
    const r = await this.collection.findOne({ name: id.name });
    if (r) {
      const unescaped = mongoUnescape(r);
      return unescaped as Element;
    } else {
      throw new Error(`cant find package with name: ${name}`);
    }
  }

  async list(opts: ListOpts = { skip: 0, limit: 0 }) {
    return this._list({}, opts);
  }

  private async _list(query: any, opts: ListOpts) {
    let cursor = this.collection.find(query, { fields: liteFields, skip: opts.skip || 0, limit: opts.limit || 0 });
    let count = await cursor.count(false);
    logger.info('[list] count: ', count);
    let arr = await cursor.toArray();

    const elements = _.map(arr, raw => ({
      name: raw.name,
      description: raw.package ? raw.package.description : null
    }));

    return { opts, count, elements };
  }
}