import { expect } from 'chai';
import { stub, match, assert, spy } from 'sinon';
import proxyquire from 'proxyquire';


describe('mongo-escape', () => {

  let mod;

  beforeEach(() => {
    mod = require('../../../../lib/services/element/mongo-escape');
  });
  it('does not escape an array of string', () => {
    expect(mod.escape({ a: ['apple', 'banana'] })).to.eql({ a: ['apple', 'banana'] });
  });

  it('does not escape an array of numbers', () => {
    expect(mod.escape({ a: [1, 2] })).to.eql({ a: [1, 2] });
  });

  it('escapes a mixed array', () => {
    expect(mod.escape({ a: [1, { $hi: 'hi' }] })).to.eql({ a: [1, { _ms_$hi: 'hi' }] });
  });

  it('escapes arrays at root', () => {
    expect(mod.escape([{ $a: 'a' }])).to.eql([{ _ms_$a: 'a' }]);
  });

  it('escapes arrays', () => {
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

  it('does not unescape arrays of strings', () => {
    expect(mod.unescape({ a: ['apple', 'banana'] })).to.eql({ a: ['apple', 'banana'] });
  });

  it('unescapes arrays at root', () => {
    expect(mod.unescape([{ _ms_$hi: 'hi' }])).to.eql([{ $hi: 'hi' }]);
  })
  it('unescapes arrays', () => {
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