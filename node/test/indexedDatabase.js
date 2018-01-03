'use strict';

//var validation = require('../src/client/lib/indexedDatabase');
var chai = require('chai');
var expect = chai.expect;

var funcs = {
  OBJECT_STORES: '',
  put: '',
  get: '',
  getAll: '',
  getByIndexOnly: '',
  delete: '',
  closeDB: '',
  deleteDB: '',
};

describe('mock describe', function() {  
  it('mock it', function() {
    expect(true).to.be.true;
  });
});

/*
describe('isNumber', function() {  
  it('undefined', function() {
    var result = validation.isNumber();
    expect(result).to.be.a('boolean');
    expect(result).to.be.false;
  });
  it('null', function() {
    var result = validation.isNumber(null);
    expect(result).to.be.a('boolean');
    expect(result).to.be.false;
  });
  it('empty', function() {
    var result = validation.isNumber('');
    expect(result).to.be.a('boolean');
    expect(result).to.be.false;
  });
  it('not number', function() {
    var result = validation.isNumber('a');
    expect(result).to.be.a('boolean');
    expect(result).to.be.false;
  });
  it('minus', function() {
    var result = validation.isNumber(-1);
    expect(result).to.be.a('boolean');
    expect(result).to.be.true;
  });
  it('zero', function() {
    var result = validation.isNumber(0);
    expect(result).to.be.a('boolean');
    expect(result).to.be.true;
  });
  it('plus', function() {
    var result = validation.isNumber(1);
    expect(result).to.be.a('boolean');
    expect(result).to.be.true;
  });
  it('number string', function() {
    var result = validation.isNumber('1');
    expect(result).to.be.a('boolean');
    expect(result).to.be.true;
  });
});

describe('isAllASCII', function() {  
  it('undefined', function() {
    var result = validation.isAllASCII();
    expect(result).to.be.a('boolean');
    expect(result).to.be.true;
  });
  it('null', function() {
    var result = validation.isAllASCII(null);
    expect(result).to.be.a('boolean');
    expect(result).to.be.true;
  });
  it('empty', function() {
    var result = validation.isAllASCII('');
    expect(result).to.be.a('boolean');
    expect(result).to.be.true;
  });
  it('number', function() {
    var result = validation.isAllASCII(123);
    expect(result).to.be.a('boolean');
    expect(result).to.be.true;
  });
  it('ascii', function() {
    var result = validation.isAllASCII('abc123');
    expect(result).to.be.a('boolean');
    expect(result).to.be.true;
  });
  it('multi', function() {
    var result = validation.isAllASCII('abcあいう123');
    expect(result).to.be.a('boolean');
    expect(result).to.be.false;
  });
});
*/
