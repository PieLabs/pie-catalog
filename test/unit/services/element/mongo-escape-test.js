import { expect } from 'chai';
import { stub, match, assert, spy } from 'sinon';
import proxyquire from 'proxyquire';


describe('mongo-escape', () => {

  let mod;

  beforeEach(() => {
    mod = require('../../../../lib/services/element/mongo-escape');
  });

  it.only('escapes arrays at root', () => {
    expect(mod.escape([{ $a: 'a' }])).to.eql([{ _ms_$a: 'a' }]);
  });

  it.only('escapes arrays', () => {
    expect(mod.escape({ a: [{ $a: 'a' }] })).to.eql({ a: [{ _ms_$a: 'a' }] });
  });

  it('escapes', () => {
    expect(mod.escape({
      a: 'a', $hi: 'hi', $ho: {
        $foo: 'foo'
      }
    })).to.eql({
      a: 'a', _ms_$hi: 'hi', _ms_$ho: {
        _ms_$foo: 'foo'
      }
    });
  });

  it.only('unescapes arrays at root', () => {
    expect(mod.unescape([{ _ms_$hi: 'hi' }])).to.eql([{ $hi: 'hi' }]);
  })
  it.only('unescapes arrays', () => {
    expect(mod.unescape({ a: [{ _ms_$hi: 'hi' }] })).to.eql({ a: [{ $hi: 'hi' }] });
  })

  it('unescapes', () => {
    const out = mod.unescape({
      apple: 'apple',
      _ms_$hi: 'hi',
      _ms_$foo: {
        _ms_$bar: 'bar'
      }
    });

    console.log(out)

    expect(out).to.eql({ apple: 'apple', $hi: 'hi', $foo: { $bar: 'bar' } });
  })
});