import { Writable, Transform } from 'stream';
import { buildLogger } from '../log-factory';

const logger = buildLogger();

export class StringTransform extends Transform {

  private _chunks: any[];

  constructor(opts?: any) {
    super(opts);
    this._chunks = [];
    logger.info('[StringTransform]');
  }

  _transform(chunk, enc, done) {
    logger.silly('[_transform]', chunk.toString('utf8'));
    this._chunks.push(chunk);
    done();
  }

  _flush(done) {
    let b = Buffer.concat(this._chunks);
    logger.silly('[_flush] b: ', b);
    this.push(b);
    done();
  }
}

