import { expect } from 'chai';
import { stub, match, assert, spy } from 'sinon';
import proxyquire from 'proxyquire';


describe('mongo-escape', () => {

  let mod; 

  beforeEach(() => {
    mod = require('../../../../lib/services/element/mongo-escape');
  });


  it('escapes', () => {
    expect(mod.escape( { a: 'a', $hi: 'hi', $ho: {
      $foo: 'foo'
    }})).to.eql({a: 'a', _ms_$hi : 'hi', _ms_$ho: {
      _ms_$foo: 'foo'
    }});
  });



  it('unescapes', () => {
    const out = mod.unescape({
      apple: 'apple',
      _ms_$hi: 'hi', 
      _ms_$foo: {
        _ms_$bar: 'bar'
      }
    });
    
    console.log(out)
    
    expect(out).to.eql({apple: 'apple', $hi: 'hi', $foo: { $bar: 'bar'}});
  })
});