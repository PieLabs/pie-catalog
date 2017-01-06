import { Element, Readable, Writable, PieId } from '../../../services';
import { buildLogger } from '../../../log-factory';
import { Collection } from 'mongodb';

import { Transform, Duplex } from 'stream';

const logger = buildLogger();

let idToQuery = (id: PieId): any => {
  return { org: id.org, repo: id.repo, sha: id.sha }
}

class StringTransform extends Transform {

  private _chunks: any[];

  constructor(opts: any) {
    super(opts);
    this._chunks = [];
  }

  _transform(chunk, enc, done) {
    this._chunks.push(chunk);
    done();
  }

  _flush(done) {
    let b = Buffer.concat(this._chunks);
    this.push(b);
    done();
  }
}

class JsonTransform extends Transform {

  private _chunks: any[];

  constructor(opts: any) {
    super(opts);
    this._chunks = [];
  }

  _transform(chunk, enc, done) {
    this._chunks.push(chunk);
    done();
  }

  _flush(done) {
    let b = Buffer.concat(this._chunks);
    let s = b.toString('utf8');
    try {
      this.push(new Buffer(s, 'utf8'));
      done();
    } catch (e) {
      done(e);
    }
  }
}

export default class Mongo implements Element {

  constructor(readonly collection: Collection) {

  }

  json(): Transform {
    return new JsonTransform({});
  }

  string(): Transform {
    return new StringTransform({});
  }

  schema(id: PieId, name: string): Writable {
    return new Writable({
      write: (chunk: Buffer, enc, done) => {
        let update = {
          $push: {
            'schemas': {
              name: name,
              schema: JSON.parse(chunk.toString('utf8'))
            }
          }
        }
        this.collection.update(idToQuery(id), update)
          .then(result => {
            done();
          })
          .catch(e => done(e));
      }
    });
  }

  pkg(id: PieId): Writable {
    return new Writable({
      write: (chunk: Buffer, enc, done) => {
        let update = {
          $set: {
            'package': JSON.parse(chunk.toString('utf8'))
          }
        }
        this.collection.update(idToQuery(id), update)
          .then(result => {
            done();
          })
          .catch(e => done(e));
      }
    })
  }

  readme(id: PieId): Writable {
    return new Writable({
      write: (buffer: Buffer, enc, done) => {
        let update = {
          $set: {
            readme: buffer.toString('utf8')
          }
        }
        this.collection.update(idToQuery(id), update)
          .then(done.bind(null, null))
          .catch(e => done(e));
      }
    });
  }

}