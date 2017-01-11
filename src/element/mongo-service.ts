import { ElementLite, Element, ListOpts, KeyMap, PieId, DemoService, ElementService as Api } from './service';
import { Collection } from 'mongodb';
import { buildLogger } from '../log-factory';
import * as _ from 'lodash';

const logger = buildLogger();

let idToQuery = (id: PieId) => {
  return {
    org: id.org,
    repo: id.repo
  }
}

const liteFields = { org: 1, repo: 1, tag: 1, 'package.description': 1 };

export default class ElementService implements Api {

  constructor(private collection: Collection, readonly demo: DemoService) {

    this.collection.createIndex({ org: 1, repo: 1, tag: 1 })
      .then(() => logger.info('org/repo/tag index created'));

    this.collection.createIndex({ org: 1, repo: 1 }, { unique: true })
      .then(() => {
        logger.info('index created');
      })
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

  saveSchema(id: PieId, name: string, schema: KeyMap) {

    let update = {
      $addToSet: {
        'schemas': {
          name: name,
          schema: schema
        }
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

  savePkg(id: PieId, pkg: KeyMap) {

    let update = {
      $set: {
        'package': pkg
      }
    }

    return this.update(id, update);
  }

  listByOrg(org: string, opts: ListOpts) {
    return this._list({ org: org }, opts);
  }

  load(org: string, repo: string) {
    return this.collection.findOne({ org: org, repo: repo })
      .then(r => {
        return r;
      });
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
      elements: arr
    };
  }
}