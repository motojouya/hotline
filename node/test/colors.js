'use strict';

var calcColors = require('../src/lib/colors'),
    chai = require('chai'),
    expect = chai.expect;

describe('calcColors', function() {  
  it('undefined', function() {
    var result = calcColors();
    expect(result).to.be.a('string');
    expect(result).to.equal('77e');
    expect(result).to.have.lengthOf(3);
  });
  it('null', function() {
    var result = calcColors(null);
    expect(result).to.be.a('string');
    expect(result).to.equal('77e');
    expect(result).to.have.lengthOf(3);
  });
  it('empty', function() {
    var result = calcColors('');
    expect(result).to.be.a('string');
    expect(result).to.equal('77e');
    expect(result).to.have.lengthOf(3);
  });
  it('not number', function() {
    var result = calcColors('a');
    expect(result).to.be.a('string');
    expect(result).to.equal('77e');
    expect(result).to.have.lengthOf(3);
  });
  it('minus', function() {
    var result = calcColors(-1);
    expect(result).to.be.a('string');
    expect(result).to.equal('77e');
    expect(result).to.have.lengthOf(3);
  });
  it('over', function() {
    var result = calcColors(24);
    expect(result).to.be.a('string');
    expect(result).to.equal('77e');
    expect(result).to.have.lengthOf(3);
  });
  it('1 string', function() {
    var result = calcColors('1');
    expect(result).to.be.a('string');
    expect(result).to.equal('78d');
    expect(result).to.have.lengthOf(3);
  });
  it('1 number', function() {
    var result = calcColors(1);
    expect(result).to.be.a('string');
    expect(result).to.equal('78d');
    expect(result).to.have.lengthOf(3);
  });
  it('0 min', function() {
    var result = calcColors(0);
    expect(result).to.be.a('string');
    expect(result).to.equal('77e');
    expect(result).to.have.lengthOf(3);
  });
  it('23 max', function() {
    var result = calcColors(23);
    expect(result).to.be.a('string');
    expect(result).to.equal('e77');
    expect(result).to.have.lengthOf(3);
  });
});


