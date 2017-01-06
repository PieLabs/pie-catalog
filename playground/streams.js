const stream = require('stream');

class JsonTransform extends stream.Transform {


  constructor(opts) {
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

let jt = new JsonTransform();

jt.on('data', (d) => {
  console.log('got: ', d.toString('utf8'));
});

jt.write('{');
jt.write('"name" :');
jt.write('"ed"');
jt.write('}');
jt.end();