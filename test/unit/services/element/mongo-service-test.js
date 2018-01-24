import { expect } from 'chai';
import { stub, match, assert, spy } from 'sinon';
import proxyquire from 'proxyquire';

function MockCursor(arr) {
  arr = arr || [];
  this.count = stub().returns(Promise.resolve(arr.length));
  this.toArray = stub().returns(Promise.resolve(arr))
}

describe('mongo-service', () => {

  let mod, demo, collection, cursor, github, service, id, bundle, mongoEscape;

  beforeEach(() => {

    id = {
      name: '@scope/name'
    }

    bundle = {
      package: {},
      repository: {},
      demo: {},
      npm: {}
    }

    demo = {
      delete: stub().returns(Promise.resolve(true))
    }

    cursor = new MockCursor();

    collection = {
      insertOne: stub().returns(Promise.resolve({})),
      createIndex: stub().returns(Promise.resolve()),
      deleteOne: stub().returns(Promise.resolve({ result: { ok: true } })),
      update: stub().returns(Promise.resolve({ result: id })),
      find: stub().returns(cursor)
    }

    github = {
      loadInfo: stub().returns(Promise.resolve({}))
    }

    mongoEscape = {
      escape: spy(input => input),
      unescape: spy(input => input)
    }

    mod = proxyquire('../../../../lib/services/element/mongo-service', {
      './mongo-escape': mongoEscape
    });
    service = new mod.default(collection, demo, github);
  });


  describe('delete', () => {

    describe('when successful', () => {
      beforeEach(() => service.delete(id));

      it('calls collection.findOneAndDelete', () => {
        assert.calledWith(collection.deleteOne, { name: id.name });
      });

      it('calls demo.delete', () => {
        assert.calledWith(demo.delete, id);
      });
    });

    describe('when collection fails', () => {
      let result;

      beforeEach(() => {
        collection.deleteOne.returns(Promise.resolve({ result: { ok: false } }));
        return service.delete(id).then(r => result = r);
      });

      it('returns ok: false', () => {
        expect(result).to.eql({ ok: false, error: 'failed to delete the repo', statusCode: 500 });
      });
    });

    describe('when demo.delete fails', () => {
      let result;

      beforeEach(() => {
        demo.delete.returns(Promise.resolve(false));
        return service.delete('org', 'repo').then(r => result = r);
      });

      it('returns ok: false', () => {
        expect(result).to.eql({ ok: false, error: 'failed to delete the demo dir', statusCode: 500 });
      });
    });
  });

  describe('saveBundle', () => {

    describe('with successful save', () => {
      beforeEach(() => {
        return service.saveBundle(id, bundle);
      });

      it('calls mongoEscape', () => {
        assert.calledWith(mongoEscape.escape, bundle);
      });

      it('calls insertOne', () => {
        assert.calledWith(collection.insertOne, bundle);
      });
    });

    describe('with error', () => {
      beforeEach(() => {
        collection.insertOne.returns(Promise.reject(new Error('!!')));
      });

      it('throws an error', () => {
        service.saveBundle(id, bundle)
          .catch(e => {
            ok();
          })
          .then(r => {
            throw new Error('should have got an error')
          });
      });

    });
  });

  describe('list', () => {

    beforeEach(() => service.list({ skip: 0, limit: 0 }));

    it('calls collection.find', () => {
      assert.calledWith(collection.find, {}, { fields: mod.liteFields, skip: 0, limit: 0 });
    });
  });

  /**
   * Currently not in use - we're probably going to list by author
   * similar to npmjs.com
   */
  xdescribe('listByOrg', () => {

    beforeEach(() => service.listByOrg('org', { skip: 0, limit: 0 }));

    it('calls collection.find', () => {
      assert.calledWith(collection.find, { org: 'org' }, { 'package.description': 1, org: 1, repo: 1, tag: 1 }, 0, 0);
    });
  });
});