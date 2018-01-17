import * as _ from 'lodash';
import * as lodash from 'lodash';

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

const logger = buildLogger();

let idToQuery = (id: PieId) => {
  return {
    org: id.org,
    repo: id.repo
  }
}

const liteFields = { org: 1, repo: 1, tag: 1, 'package.description': 1 };

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

    this.collection.createIndex({ org: 1, repo: 1, tag: 1 })
      .then(() => logger.silly('org/repo/tag index created'));

    this.collection.createIndex({ org: 1, repo: 1 }, { unique: true })
      .then(() => {
        logger.silly('index created');
      })
  }

  async delete(org: string, repo: string): Promise<DeleteResult> {
    logger.debug('[delete], org: ', org, 'repo: ', repo);

    let query = { org: org, repo: repo };
    let removeResult = await this.collection.findOneAndDelete(query);
    logger.silly('[delete] removeResult: ', removeResult);

    if (removeResult.ok && removeResult.value) {
      let id = new PieId(org, repo, removeResult.value.tag);
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

  reset(id: PieId) {
    //TODO - wipe schemas here? back up document?
    return Promise.resolve(true);
  }

  saveConfigureMap(id: PieId, configureMap: KeyMap): Promise<boolean> {

    let update = { $set: { configureMap } };
    return this.update(id, update);
  }

  mongoEscape(data: KeyMap): KeyMap {
    return _.reduce(data, (acc, value, key) => {
      if (key.startsWith('$')) {
        acc[`_ms_${key}`] = _.isObject(value) ? this.mongoEscape(value) : value;
        return acc;
      }
    }, {});
  }

  mongoUnescape(data: KeyMap): KeyMap {
    return _.reduce(data, (acc, value, key) => {
      if (key.startsWith('_ms_')) {
        acc[key.replace('_ms_', '')] = _.isObject(value) ? this.mongoEscape(value) : value;
        return acc;
      }
    }, {});
  }

  saveSchema(id: PieId, name: string, schema: KeyMap) {
    const safeSchema = this.mongoEscape(schema);
    let update = {
      $addToSet: {
        'schemas': {
          name,
          schema: safeSchema
        }
      }
    }
    return this.update(id, update);
  }


  saveExternals(id: PieId, externals: any) {
    let update = {
      $set: {
        externals: externals
      }
    }
    return this.update(id, update);
  }

  saveReadme(id: PieId, readme: string) {

    let update = {
      $set: {
        readme: readme
      }
    }
    return this.update(id, update);
  }

  async savePkg(id: PieId, pkg: KeyMap) {
    //convert to [{key,value}, ...] to prevent invalid field names being inserted.
    pkg.dependencies = toKeyValueArray(pkg.dependencies);
    pkg.devDependencies = toKeyValueArray(pkg.devDependencies);
    let update = {
      $set: {
        'package': pkg,
      }
    }

    try {
      update.$set['github'] = await this.github.loadInfo(id.org, id.repo);
    } catch (e) {
      logger.warn('github.loadInfo failed: ', e);
    }

    return this.update(id, update);
  }

  listByOrg(org: string, opts: ListOpts) {
    return this._list({ org: org }, opts);
  }

  tag(org: string, repo: string) {
    return this.collection.findOne({ org: org, repo: repo }, { fields: { tag: 1 } })
      .then((r) => r.tag);
  }

  async load(org: string, repo: string) {
    let r = await this.collection.findOne({ org: org, repo: repo });

    if (r) {

      //TODO: should we store this in the db instead of getting it from the demo service?
      let demo = await this.demo.configAndMarkup(new PieId(r.org, r.repo, r.tag));
      r.package.dependencies = toKeyMap(r.package.dependencies);
      r.package.devDependencies = toKeyMap(r.package.devDependencies);

      r.schemas = _.map(r.schemas, s => this.mongoUnescape(s));

      let out = _.merge(r, { demo: demo });
      logger.silly('[load] out: ', out);
      return out;
    } else {
      throw new Error(`cant find org/repo: ${org}/${repo}`);
    }
  }

  async list(opts: ListOpts = { skip: 0, limit: 0 }) {
    return this._list({}, opts);
  }

  private async _list(query: any, opts: ListOpts) {
    let cursor = this.collection.find(query, liteFields, opts.skip || 0, opts.limit || 0);
    let count = await cursor.count(false);
    logger.info('[list] count: ', count);
    let arr = await cursor.toArray();

    let elements = _.map(arr, raw => {
      return {
        org: raw.org,
        repo: raw.repo,
        tag: raw.tag,
        description: raw.package ? raw.package.description : null
      }
    })
    return {
      opts: opts,
      count: count,
      elements: elements
    };
  }
}