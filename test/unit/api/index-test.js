import { expect } from 'chai';
import { stub, match, assert, spy } from 'sinon';
import proxyquire from 'proxyquire';
import * as _ from 'lodash';
import { MockResponse, MockRouter } from '../helpers';

describe('api', () => {

  let mod, deps, router, elementService, handler, req, res, listResult, getDemoLink, pkgName;

  beforeEach(() => {
    pkgName = '@scope/name';
    router = new MockRouter();
    res = new MockResponse();

    req = {
      params: {}
    };

    listResult = [{ name: pkgName }];

    elementService = {
      list: stub().returns(Promise.resolve({
        count: listResult.length, elements: listResult
      })),
      listByOrg: stub().returns(Promise.resolve({
        count: listResult.length, elements: listResult
      })),
      delete: stub().returns(Promise.resolve({ ok: true })),
      load: stub().returns(Promise.resolve(req.params))
    }

    deps = {
      'express': {
        Router: stub().returns(router)
      }
    }

    mod = proxyquire('../../../lib/api', deps);
    getDemoLink = stub().returns('demoLink');
    mod.default(elementService, getDemoLink);
  });

  describe('GET /', () => {
    beforeEach(() => {
      handler = router.handlers.get['/']
    });

    it('calls send', () => {
      handler(req, res);
      assert.calledWith(res.send, 'api here...');
    });
  });

  describe('GET /element', () => {
    beforeEach((done) => {
      handler = router.handlers.get['/element'];
      res.done = done;
      handler(req, res);
    });

    it('calls service.list', () => {
      assert.calledWith(elementService.list, { skip: 0, limit: 0 });
    });

    it('calls res.json', () => {
      assert.calledWith(res.json, {
        count: 1, elements: [
          _.merge(listResult[0], { repoLink: '/element/org/repo' })
        ]
      });
    });
  });

  describe('DELETE /element/:name', () => {

    beforeEach((done) => {
      handler = router.handlers.delete[/^\/element\/(.*)/];
      res.done = done;
      req.params = [pkgName]
      handler(req, res);
    });

    it('calls service.delete', () => {
      assert.calledWith(
        elementService.delete,
        match(n => n.name === pkgName)
      );
    });

    it('calls res.json', () => {
      assert.calledWith(res.json, { success: true });
    });

  });

  describe('GET /element/*name', () => {

    beforeEach((done) => {
      elementService.load.returns(Promise.resolve({ name: pkgName }));
      handler = router.handlers.get[/^\/element\/(.*)/];
      req.params = [pkgName];
      res.done = done;
      handler(req, res);
    });

    it('calls service.load', () => {
      assert.calledWith(elementService.load, match(i => i.name === pkgName));
    });

    it('calls getDemoLink', () => {
      assert.calledWith(getDemoLink, match(i => i.name === pkgName));
    });

    it('calls res.json', () => {
      assert.calledWith(res.json, _.extend({ name: pkgName }, { demoLink: 'demoLink', schemas: [] }));
    });
  });
});