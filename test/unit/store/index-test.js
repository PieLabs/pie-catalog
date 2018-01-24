import { stub, assert, spy, match } from 'sinon';
import { expect } from 'chai';
import proxyquire from 'proxyquire';
import { Writable, Readable } from 'stream';
import * as _ from 'lodash';
import { MockRouter } from '../helpers';
import { setDefaultLevel } from 'log-factory';
describe('store', () => {

  let mod, express, router, tarStream, extract, extractHandlers, gunzipMaybe, elementService, mkRouter, ingestHandler;

  beforeEach(() => {

    router = new MockRouter();

    express = {
      Router: stub().returns(router)
    }

    tarStream = {
      extract: stub()
    }

    gunzipMaybe = stub();

    elementService = {
      demo: {
        upload: stub().returns(Promise.resolve(null))
      },
      reset: stub().returns(Promise.resolve(null)),
      delete: stub().returns(Promise.resolve(null)),
      saveBundle: stub().returns(Promise.resolve(true))
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

    this.handlers = {};
    this.on = (keyword, handler) => {
      this.handlers[keyword] = handler;
    };

    this.entry = (header, stream, next) => {
      this.handlers.entry(header, stream, next);
    }
  }

  class MockWritable extends Writable {
    constructor() {
      super();
      this.handlers = {}
    }
    on(key, handler) {
      this.handlers[key] = handler;
    }
  }

  function MockJsonStream(data) {
    var handlers = {}
    this.on = function (keyword, handler) {
      handlers[keyword] = handler;
    }

    this.flush = function () {
      handlers['data'](JSON.stringify(data));
      handlers['end']();
    }
  }

  describe('POST /ingest', () => {
    let res, responseJson, mockExtract, writables;

    beforeEach((done) => {
      writables = [];
      mockExtract = new MockExtract();
      tarStream.extract.returns(mockExtract);

      mod.writeStream = spy(function () {
        let w = new MockWritable();
        writables.push(w);
        return w;
      });

      mkRouter(elementService);

      let req = {
        params: {
          org: 'org', repo: 'repo', tag: '1.0.0'
        },
      };

      req.pipe = stub().returns(req);

      res = {}
      res.status = stub().returns(res);
      res.json = spy(function (json) {
        responseJson = json;
        done();
      });

      ingestHandler = router.handlers.post['/ingest'];

      const pkgInfo = {
        package: {
          name: '@scope/name'
        }
      }
      ingestHandler(req, res)
        .then(() => {
          const jsonStream = new MockJsonStream(pkgInfo);
          mockExtract.handlers.entry({ name: 'pie-catalog-data.json' }, jsonStream, stub());
          jsonStream.flush();
          mockExtract.handlers.entry({ name: 'test.txt' }, { on: stub() }, stub());
          mockExtract.handlers.finish();
          writables.forEach(w => {
            console.log('writables: ', writables);
            w.handlers.finish();
          });
        })
        .catch(done);
    });

    it('calls saveBundle', done => {
      setTimeout(() => {
        assert.calledWith(elementService.saveBundle, match.object, match.object);
        done();
      }, 0);
    })
    it('returns json', () => {
      assert.calledWith(res.json, { success: true, files: ['test.txt'] });
    });

    it('returns ok', () => {
      assert.calledWith(res.status, 200);
    });
  });

  describe('writeStream', () => {

    let handles = (parts, name, assertFn) => {

      let header = _.isObject(name) ? name : { name: name, type: 'file' };
      return (done) => {

        const id = { name: 'package-id' };
        let stream = new Readable();
        stream._read = () => { }
        parts.forEach(p => stream.push(p));
        stream.push(null);

        let ws = mod.writeStream(id, elementService, stream, header.name, header);

        if (ws) {
          ws.on('finish', () => {
            try {
              assertFn(id);
              done();
            } catch (e) {
              done(e);
            }
          });
          ws.on('error', done);

        } else {
          assertFn(id);
          done();
        }
      }
    }

    it('skips directories', handles([], { name: 'some-dir', type: 'directory' }, (id) => {
      assert.notCalled(elementService.saveBundle);
    }));

    it('handles any other files as a demo file', handles([], 'some-file.txt', (id) => {
      assert.calledWith(elementService.demo.upload, id, 'some-file.txt', match.object);
    }));

  });
});
