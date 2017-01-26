import { stub, assert, spy, match } from 'sinon';
import { expect } from 'chai';
import proxyquire from 'proxyquire';
import { Writable, Readable } from 'stream';

describe('store', () => {

  let mod, express, router, tarStream, gunzipMaybe, elementService, mkRouter, ingestHandler;

  beforeEach(() => {

    router = {
      get: stub(),
      post: spy(function (key, fn) {
        ingestHandler = fn;
      })
    }

    express = {
      Router: stub().returns(router)
    }

    tarStream = {
      extract: stub()
    }

    gunzipMaybe = stub();

    elementService = {
      demo: {
        upload: stub().yields(null)
      },
      reset: stub().returns(Promise.resolve(null)),
      savePkg: stub().returns(Promise.resolve()),
      saveReadme: stub().returns(Promise.resolve())
    }

    mod = proxyquire('../../../lib/store', {
      'express': express,
      'tar-stream': tarStream,
      'gunzip-maybe': gunzipMaybe
    });
    mkRouter = mod.default;
  });

  let mockReadable = () => {
    return {
      pipe: stub().returns({})
    }
  }

  function MockExtract() {

    let handlers = {};
    this.on = (keyword, handler) => {
      handlers[keyword] = handler;
    };
    this.entry = (header, stream, next) => {
      handlers.entry(header, stream, next);
    }
  }

  describe('onEntry', () => {
    beforeEach(() => {
    });

    let handles = (parts, name, assertFn) => {
      return (done) => {
        let id = { org: 'org', repo: 'repo', tag: 'tag' }
        let stream = new Readable();
        stream._read = () => { }
        parts.forEach(p => stream.push(p));
        stream.push(null);

        let ws = mod.onEntry(id, elementService, { type: 'file', name: name }, stream, (e) => { });

        ws.on('finish', () => {
          try {
            assertFn(id);
            done();
          } catch (e) {
            done(e);
          }
        });
        ws.on('error', done);

      }
    }

    it.only('handles pie-pkg/package.json', handles(['{', '"hello"', ':', '"there"', '}'], 'pie-pkg/package.json', (id) => {
      assert.calledWith(elementService.savePkg, id, { hello: 'there' });
    }));

    it.only('handles pie-pkg/README.md', handles(['#', 'README'], 'pie-pkg/README.md', (id) => {
      assert.calledWith(elementService.saveReadme, id, '#README');
    }));

    // it('handles pie-pkg/package.json', (done) => {
    //   let id = { org: 'org', repo: 'repo', tag: 'tag' }
    //   let stream = new Readable();
    //   stream._read = () => { }
    //   stream.push('{')
    //   stream.push('}');
    //   stream.push(null);

    //   let ws = mod.onEntry(id, elementService, { type: 'file', name: 'pie-pkg/package.json' }, stream, (e) => { });

    //   ws.on('finish', () => {
    //     try {
    //       assert.calledWith(elementService.savePkg, id, {});
    //       done();
    //     } catch (e) {
    //       done(e);
    //     }
    //   });
    //   ws.on('error', done);
    // });
    // let handles = (name, assertFn) => {
    //   return (done) => {
    //     let r = mkRouter(elementService);
    //     let extract = new MockExtract();
    //     tarStream.extract.returns(extract)

    //     let req = {
    //       params: {
    //         org: 'org',
    //         repo: 'repo',
    //         tag: '1.0.0',
    //       },
    //       pipe: stub().returns(mockReadable())

    //     }

    //     let res = {

    //     }

    //     ingestHandler(req, res)
    //       .then(() => {
    //         let next = stub();
    //         let stream = new Readable();
    //         let handlers = {};
    //         stream._read = () => { }
    //         stream.push('{');
    //         stream.push('  ');
    //         stream.push('}');
    //         stream.push(null);
    //         stream.on = (key, handler) => {
    //           handlers[key] = handler;
    //         }

    //         // stream.pipe(new Writable({
    //         //   write: function (chunk, enc, done) {
    //         //     console.log('write args: ', chunk.toString('utf8'));
    //         //     done();
    //         //   }
    //         // })).on('finish', () => {
    //         //   done();
    //         // });
    //         extract.entry({ name: name, type: 'file' }, stream, (err) => {
    //         });

    //         stream.on('finish', () => {
    //           assertFn(req);
    //           done(err);
    //         });
    //         stream.on('error', done);
    //         handlers.end();
    //       })
    //       .catch(done);
    //   }
    // };

    // it.only('handles pie-pkg/package.json', handles('pie-pkg/package.json', req => {
    //   assert.calledWith(elementService.savePkg, req.params, {});
    // }));

    // it('handles docs/demo', handles('docs/demo/example.html', (req) => {
    //   assert.calledWith(elementService.demo.upload, req.params, 'docs/demo/example.html', match.any, match.func);
    // }));

    // it('handles ./docs/demo', handles('./docs/demo/example.html', (req) => {
    //   assert.calledWith(elementService.demo.upload, req.params, 'docs/demo/example.html', match.any, match.func);
    // }));
  });
});
