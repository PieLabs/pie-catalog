import { Writable, Transform } from 'stream';

export function toStream<A>(p: Promise<A>): Writable {

  return new Writable({
    write: (chunk, enc, done) => {

    }
  })
}

export class StringTransform extends Transform {

  private _chunks: any[];

  constructor(opts?: any) {
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

