import { stub, assert, spy, match } from 'sinon';
import { expect } from 'chai';
import proxyquire from 'proxyquire';
import { Readable } from 'stream';

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
      reset: stub().returns(Promise.resolve(null))
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

  describe('post /ingest/:org/:repo/:tag', () => {

    let handles = (name) => {
       return (done) => {
        let r = mkRouter(elementService);
        let extract = new MockExtract();
        tarStream.extract.returns(extract)

        let req = {
          params: {
            org: 'org',
            repo: 'repo',
            tag: '1.0.0',
          },
          pipe: stub().returns(mockReadable())
        
        }

        let res = {

        }

        ingestHandler(req, res)
          .then(() => {
            let next = stub();
            let stream = new Readable({
              read: (size) => {
                this.push(new Buffer('<html></htm>', 'utf8'));
                this.push(null);
              }
            });

            extract.entry({ name: name, type: 'file' }, stream, (err) => {
              assert.calledWith(elementService.demo.upload, req.params, 'docs/demo/example.html', match.any, match.func);
              done();
            });

          })
          .catch(done);
       } 
    };

    it('handles docs/demo', handles('docs/demo/example.html')); 
    it('handles ./docs/demo', handles('./docs/demo/example.html')); 
  });
});
