'use strict'

// sessionをkeepする方法

var expect = require('chai').expect;
var http = require('http');
var agent = require('superagent');
var SCHEME = 'http';
var HOST = '127.0.0.1'; //process.env.APP_HOST;
var PORT = '8080'; //process.env.APP_PORT;
var PATH = '/api/v1';
var BASE = SCHEME + '://' + HOST + ':' + PORT + PATH;

beforeEach(function (done) {
    console.log('before every test');
    done();
});

afterEach(function (done) {
    console.log('after every test')
    done();
});

describe('relation', function () {

  it('relation single result no relation_no', function(done){
    agent.get(BASE + '/relation')
      .end(function (err, res) {
        expect(err).to.be.empty;
        var payload = res.body;
        expect(payload).to.be.a('string');
        expect(payload).to.be.equal('You need parameter relation_no.');
        done();
      });
  });

  it('relation single result relation_no nan', function(done){
    agent.get(BASE + '/relation')
      .query({
        relation_no: 'a'
      }).end(function (err, res) {
        expect(err).to.be.empty;
        var payload = res.body;
        expect(payload).to.be.a('string');
        expect(payload).to.be.equal('relation_no must to be number.');
        done();
      });
  });

  it('relation single result empty', function(done){
    agent.get(BASE + '/relation')
      .query({
        relation_no: 111
      }).end(function (err, res) {
        expect(err).to.be.empty;
        var payload = res.body;
        expect(payload).to.be.a('Object');
        expect(payload).to.be.empty;
        done();
      });
  });

  it('relation single result', function(done){
    agent.get(BASE + '/relation')
      .query({
        relation_no: 1
      }).end(function (err, res) {
        expect(err).to.be.empty;
        var payload = res.body;
        expect(payload).to.be.a('Object');
        expect(payload).to.have.property('relation_no').with.equal(1);
        expect(payload).to.have.property('userid').with.equal('hamada');
        expect(payload).to.have.property('name').with.equal('浜田');
        expect(payload).to.have.property('is_applicant').with.true;
        expect(payload).to.have.property('colorNumber').with.equal('313');
        expect(payload).to.have.property('status').with.equal('ACTIVE');
        expect(payload).to.have.property('thumbnail').with.equal('/app/img/test.jpg');
        done();
      });
  });

  it('relation single result with extra parameter', function(done){
    agent.get(BASE + '/relation')
      .query({
        relation_no: 1,
        offset: 0,
        limit: 10,
      }).end(function (err, res) {
        expect(err).to.be.empty;
        var payload = res.body;
        expect(payload).to.be.a('Object');
        expect(payload).to.have.property('relation_no').with.equal(1);
        expect(payload).to.have.property('userid').with.equal('hamada');
        expect(payload).to.have.property('name').with.equal('浜田');
        expect(payload).to.have.property('is_applicant').with.true;
        expect(payload).to.have.property('colorNumber').with.equal('313');
        expect(payload).to.have.property('status').with.equal('ACTIVE');
        expect(payload).to.have.property('thumbnail').with.equal('/app/img/test.jpg');
        done();
      });
  });

  it('relation multi result no limit', function(done){
    agent.get(BASE + '/relation')
      .query({
        offset: 0,
      }).end(function (err, res) {
        expect(err).to.be.empty;
        var payload = res.body;
        expect(payload).to.be.a('string');
        expect(payload).to.be.equal('You need parameter limit.');
        done();
      });
  });

  it('relation multi result no offset', function(done){
    agent.get(BASE + '/relation')
      .query({
        limit: 10,
      }).end(function (err, res) {
        expect(err).to.be.empty;
        var payload = res.body;
        expect(payload).to.be.a('string');
        expect(payload).to.be.equal('You need parameter offset.');
        done();
      });
  });

  it('relation multi result limit nan', function(done){
    agent.get(BASE + '/relation')
      .query({
        offset: 0,
        limit: 'a',
      }).end(function (err, res) {
        expect(err).to.be.empty;
        var payload = res.body;
        expect(payload).to.be.a('string');
        expect(payload).to.be.equal('limit must to be number.');
        done();
      });
  });

  it('relation multi result offset nan', function(done){
    agent.get(BASE + '/relation')
      .query({
        offset: 'a',
        limit: 10,
      }).end(function (err, res) {
        expect(err).to.be.empty;
        var payload = res.body;
        expect(payload).to.be.a('string');
        expect(payload).to.be.equal('offset must to be number.');
        done();
      });
  });

  it('relation multi result first page', function(done){
    agent.get(BASE + '/relation')
      .query({
        offset: 0,
        limit: 10,
      }).end(function (err, res) {
        expect(err).to.be.empty;
        var payload = res.body;
        expect(payload).to.have.property('hasNext').with.true;
        expect(payload).to.have.property('results').with.a('Array');
        expect(payload).to.have.property('results').with.lengthOf(10);
        var results = payload.results;
        for (var i = 0; i < results.length; i++) {
          expect(results[i]).to.have.property('relation_no').with.equal(i + 1);
          expect(results[i]).to.have.property('userid').with.equal('hamada');
          expect(results[i]).to.have.property('name').with.equal('浜田');
          expect(results[i]).to.have.property('is_applicant').with.true;
          expect(results[i]).to.have.property('colorNumber').with.equal('313');
          expect(results[i]).to.have.property('status').with.equal('ACTIVE');
          expect(results[i]).to.have.property('thumbnail').with.equal('/app/img/test.jpg');
        }
        done();
      });
  });

  it('relation multi result last page', function(done){
    agent.get(BASE + '/relation')
      .query({
        offset: 10,
        limit: 10,
      }).end(function (err, res) {
        expect(err).to.be.empty;
        var payload = res.body;
        expect(payload).to.have.property('hasNext').with.false;
        expect(payload).to.have.property('results').with.a('Array');
        expect(payload).to.have.property('results').with.lengthOf(5);
        var results = payload.results;
        for (var i = 0; i < payload.length; i++) {
          expect(results[i]).to.have.property('relation_no').with.equal(i + 11);
          expect(results[i]).to.have.property('userid').with.equal('hamada');
          expect(results[i]).to.have.property('name').with.equal('浜田');
          expect(results[i]).to.have.property('is_applicant').with.true;
          expect(results[i]).to.have.property('colorNumber').with.equal('313');
          expect(results[i]).to.have.property('status').with.equal('ACTIVE');
          expect(results[i]).to.have.property('thumbnail').with.equal('/app/img/test.jpg');
        }
        done();
      });
  });

  it('relation multi result empty', function(done){
    agent.get(BASE + '/relation')
      .query({
        offset: 30,
        limit: 10,
      }).end(function (err, res) {
        expect(err).to.be.empty;
        var payload = res.body;
        expect(payload).to.have.property('hasNext').with.false;
        expect(payload).to.have.property('results').with.a('Array');
        expect(payload).to.have.property('results').with.empty;
        done();
      });
  });

  it('relation make fault', function(done){
    agent
      .post(BASE + '/relation/')
      .send({
        userid: 'test',
        countersign: 'countersign',
      }).end(function (err, res) {
        expect(err).to.be.empty;
        var payload = res.body;
        expect(payload).to.be.a('Object');
        expect(payload).to.be.empty;
        done();
      });
  });

  it('relation make success', function(done){
    agent
      .post(BASE + '/relation/')
      .send({
        userid: 'takasu',
        countersign: 'writer',
      }).end(function (err, res) {
        expect(err).to.be.empty;
        var payload = res.body;
        expect(payload).to.be.a('Object');
        expect(payload).to.have.property('relation_no').with.equal(1);
        expect(payload).to.have.property('userid').with.equal('hamada');
        expect(payload).to.have.property('name').with.equal('浜田');
        expect(payload).to.have.property('is_applicant').with.true;
        expect(payload).to.have.property('colorNumber').with.equal('313');
        expect(payload).to.have.property('status').with.equal('PENDING');
        expect(payload).to.have.property('thumbnail').with.equal('/app/img/test.jpg');
        done();
      });
  });

  it('relation make success', function(done){
    agent
      .post(BASE + '/relation/')
      .send({
        userid: 'hamada',
        countersign: 'downtown',
      }).end(function (err, res) {
        expect(err).to.be.empty;
        var payload = res.body;
        expect(payload).to.be.a('Object');
        expect(payload).to.have.property('relation_no').with.equal(1);
        expect(payload).to.have.property('userid').with.equal('hamada');
        expect(payload).to.have.property('name').with.equal('浜田');
        expect(payload).to.have.property('is_applicant').with.true;
        expect(payload).to.have.property('colorNumber').with.equal('313');
        expect(payload).to.have.property('status').with.equal('ACTIVE');
        expect(payload).to.have.property('thumbnail').with.equal('/app/img/test.jpg');
        done();
      });
  });

  it('relation make no userid', function(done){
    agent
      .post(BASE + '/relation/')
      .send({
        countersign: 'downtown',
      }).end(function (err, res) {
        expect(err).to.be.empty;
        var payload = res.body;
        expect(payload).to.be.a('string');
        expect(payload).to.be.equal('You need parameter userid.');
        done();
      });
  });

  it('relation make no countersign', function(done){
    agent
      .post(BASE + '/relation/')
      .send({
        userid: 'hamada',
      }).end(function (err, res) {
        expect(err).to.be.empty;
        var payload = res.body;
        expect(payload).to.be.a('string');
        expect(payload).to.be.equal('You need parameter countersign.');
        done();
      });
  });

  it('relation break no resource', function(done){
    agent
      .delete(BASE + '/relation/a')
      .end(function (err, res) {
        expect(res).to.be.empty;
        expect(err).to.be.a('Object');
        expect(err).to.have.property('status').with.equal(404);
        expect(err).to.have.property('message').with.equal('Not found');
        done();
      });
  });

  it('relation break fault', function(done){
    agent
      .delete(BASE + '/relation/101')
      .end(function (err, res) {
        expect(err).to.be.empty;
        var payload = res.body;
        expect(payload).to.be.a('Object');
        expect(payload).to.be.empty;
        done();
      });
  });

  it('relation break success', function(done){
    agent
      .delete(BASE + '/relation/2')
      .end(function (err, res) {
        expect(err).to.be.empty;
        var payload = res.body;
        expect(payload).to.be.a('Object');
        expect(payload).to.have.property('relation_no').with.equal(2);
        expect(payload).to.have.property('userid').with.equal('takasu');
        expect(payload).to.have.property('name').with.equal('高須');
        expect(payload).to.have.property('is_applicant').with.false;
        expect(payload).to.have.property('colorNumber').with.equal('313');
        expect(payload).to.have.property('status').with.equal('BROKEN');
        expect(payload).to.have.property('thumbnail').with.equal('/app/img/test.jpg');
        done();
      });
  });
});

describe('voices', function () {

  it('voices empty', function(done){
    agent.get(BASE + '/voices/101')
      .query({
        offset: 0,
        limit: 10,
      }).end(function (err, res) {
        expect(err).to.be.empty;
        var payload = res.body;
        expect(payload).to.be.a('Array');
        expect(payload).to.be.empty;
        done();
      });
  });

  it('voices first page', function(done){
    agent.get(BASE + '/voices/1')
      .query({
        offset: 0,
        limit: 10,
      }).end(function (err, res) {
        expect(err).to.be.empty;
        var payload = res.body;
        expect(payload).to.have.property('hasNext').with.true;
        expect(payload).to.have.property('results').with.a('Array');
        expect(payload).to.have.property('results').with.lengthOf(10);
        var results = payload.results;
        for (var i = 0; i < results.length; i++) {
          expect(results[i]).to.have.property('voice_no').with.equal(i + 1);
          expect(results[i]).to.have.property('userid').with.equal('hamada');
          expect(results[i]).to.have.property('message').with.equal('どういたしまして');
          expect(results[i]).to.have.property('meta_flag').with.null;
          expect(results[i]).to.have.property('file_no').with.null;
          expect(results[i]).to.have.property('tel_flag').with.null;
        }
        done();
      });
  });

  it('voices last page', function(done){
    agent.get(BASE + '/voices/1')
      .query({
        offset: 10,
        limit: 10,
      }).end(function (err, res) {
        expect(err).to.be.empty;
        var payload = res.body;
        expect(payload).to.have.property('hasNext').with.false;
        expect(payload).to.have.property('results').with.a('Array');
        expect(payload).to.have.property('results').with.lengthOf(5);
        var results = payload.results;
        for (var i = 0; i < results.length; i++) {
          expect(results[i]).to.have.property('voice_no').with.equal(i + 11);
          expect(results[i]).to.have.property('userid').with.equal('hamada');
          expect(results[i]).to.have.property('message').with.equal('どういたしまして');
          expect(results[i]).to.have.property('meta_flag').with.null;
          expect(results[i]).to.have.property('file_no').with.null;
          expect(results[i]).to.have.property('tel_flag').with.null;
        }
        done();
      });
  });

  it('voices no limit', function(done){
    agent.get(BASE + '/voices/1')
      .query({
        offset: 0,
      }).end(function (err, res) {
        expect(err).to.be.empty;
        var payload = res.body;
        expect(payload).to.be.a('string');
        expect(payload).to.be.equal('You need parameter limit.');
        done();
      });
  });

  it('voices no offset', function(done){
    agent.get(BASE + '/voices/1')
      .query({
        limit: 10,
      }).end(function (err, res) {
        expect(err).to.be.empty;
        var payload = res.body;
        expect(payload).to.be.a('string');
        expect(payload).to.be.equal('You need parameter offset.');
        done();
      });
  });

  it('voices limit nan', function(done){
    agent.get(BASE + '/voices/1')
      .query({
        offset: 0,
        limit: 'a',
      }).end(function (err, res) {
        expect(err).to.be.empty;
        var payload = res.body;
        expect(payload).to.be.a('string');
        expect(payload).to.be.equal('limit must to be number.');
        done();
      });
  });

  it('voices offset nan', function(done){
    agent.get(BASE + '/voices/1')
      .query({
        offset: 'a',
        limit: 10,
      }).end(function (err, res) {
        expect(err).to.be.empty;
        var payload = res.body;
        expect(payload).to.be.a('string');
        expect(payload).to.be.equal('offset must to be number.');
        done();
      });
  });

});

describe('config', function () {

  it('config get', function(done){
    agent.get(BASE + '/config').end(function (err, res) {
        expect(err).to.be.empty;
        var payload = res.body;
        expect(payload).to.be.a('Object');
        expect(payload).to.have.property('userid').with.equal('matsumoto');
        expect(payload).to.have.property('name').with.equal('松本 人志');
        expect(payload).to.have.property('email').with.equal('test@gmail.com');
        expect(payload).to.have.property('countersign').with.equal('peru');
        expect(payload).to.have.property('colorNumber').with.equal('123');
        expect(payload).to.have.property('thumbnail').with.equal('/app/img/test.jpg');
        expect(payload).to.have.property('notification').with.equal(0);
        done();
    });
  });

  it('config change none', function(done){
    agent
      .put(BASE + '/config')
      .send({
        userid: 'matumoto',
      }).end(function (err, res) {
        expect(err).to.be.empty;
        var payload = res.body;
        expect(payload).to.be.a('Object');
        expect(payload).to.have.property('userid').with.equal('matsumoto');
        expect(payload).to.have.property('name').with.equal('松本 人志');
        expect(payload).to.have.property('email').with.equal('test@gmail.com');
        expect(payload).to.have.property('countersign').with.equal('peru');
        expect(payload).to.have.property('colorNumber').with.equal(123);
        expect(payload).to.have.property('thumbnail').with.equal('/app/img/test.jpg');
        expect(payload).to.have.property('notification').with.equal(0);
        done();
    });
  });

  it('config change success', function(done){
    agent
      .put(BASE + '/config')
      .send({
        name: '松下 人志',
        email: 'test2@gmail.com',
        countersign: 'chili',
        colorNumber: 321,
        notification: 1,
        userid: 'matumoto',
        now_password: 'password01',
        new_password: 'password02',
      }).end(function (err, res) {
        expect(err).to.be.empty;
        var payload = res.body;
        expect(payload).to.be.a('Object');
        expect(payload).to.have.property('userid').with.equal('matsumoto');
        expect(payload).to.have.property('name').with.equal('松下 人志');
        expect(payload).to.have.property('email').with.equal('test2@gmail.com');
        expect(payload).to.have.property('countersign').with.equal('chili');
        expect(payload).to.have.property('colorNumber').with.equal(321);
        expect(payload).to.have.property('thumbnail').with.equal('/app/img/test.jpg');
        expect(payload).to.have.property('notification').with.equal(1);
        expect(payload).to.have.property('password_changed').with.equal(true);
        done();
    });
  });

  it('config password fault same', function(done){
    agent
      .put(BASE + '/config')
      .send({
        name: '松下 人志',
        email: 'test2@gmail.com',
        countersign: 'chili',
        colorNumber: 321,
        notification: 1,
        userid: 'matumoto',
        now_password: 'password01',
        new_password: 'password01',
      }).end(function (err, res) {
        expect(err).to.be.empty;
        var payload = res.body;
        expect(payload).to.be.a('string');
        expect(payload).to.be.equal('new password is same as now password.');
        done();
    });
  });

  it('config password fault no now', function(done){
    agent
      .put(BASE + '/config')
      .send({
        name: '松下 人志',
        email: 'test2@gmail.com',
        countersign: 'chili',
        colorNumber: 321,
        notification: 1,
        userid: 'matumoto',
        new_password: 'password02',
      }).end(function (err, res) {
        expect(err).to.be.empty;
        var payload = res.body;
        expect(payload).to.be.a('string');
        expect(payload).to.be.equal('Yor need now password.');
        done();
    });
  });

  it('config password fault no new', function(done){
    agent
      .put(BASE + '/config')
      .send({
        name: '松下 人志',
        email: 'test2@gmail.com',
        countersign: 'chili',
        colorNumber: 321,
        notification: 1,
        userid: 'matumoto',
        now_password: 'password01',
      }).end(function (err, res) {
        expect(err).to.be.empty;
        var payload = res.body;
        expect(payload).to.be.a('string');
        expect(payload).to.be.equal('Yor need new password.');
        done();
    });
  });

  it('config notification out of value', function(done){
    agent
      .put(BASE + '/config')
      .send({
        name: '松下 人志',
        email: 'test2@gmail.com',
        countersign: 'chili',
        colorNumber: 321,
        notification: 8,
        userid: 'matumoto',
        now_password: 'password01',
        new_password: 'password02',
      }).end(function (err, res) {
        expect(err).to.be.empty;
        var payload = res.body;
        expect(payload).to.be.a('string');
        expect(payload).to.be.equal('notification must be 0 or 1 or 2.');
        done();
    });
  });

});

describe('certification', function () {

  it('certification login success', function(done){
    agent.post(BASE + '/login')
      .send({
        userid: 'matsumoto',
        password: 'password01',
      }).end(function (err, res) {
        expect(err).to.be.empty;
        var payload = res.body;
        expect(payload).to.be.a('Object');
        expect(payload).to.have.property('login').with.true;
        expect(payload).to.have.property('message').with.equal('you logged in.');
        done();
      });
  });

  it('certification login fault userid', function(done){
    agent.post(BASE + '/login')
      .send({
        userid: 'matumoto',
        password: 'password01',
      }).end(function (err, res) {
        expect(err).to.be.empty;
        var payload = res.body;
        expect(payload).to.be.a('Object');
        expect(payload).to.have.property('login').with.false;
        expect(payload).to.have.property('message').with.equal('userid or password is different.');
        done();
      });
  });

  it('certification login fault password', function(done){
    agent.post(BASE + '/login')
      .send({
        userid: 'matsumoto',
        password: 'password10',
      }).end(function (err, res) {
        expect(err).to.be.empty;
        var payload = res.body;
        expect(payload).to.be.a('Object');
        expect(payload).to.have.property('login').with.false;
        expect(payload).to.have.property('message').with.equal('userid or password is different.');
        done();
      });
  });

  it('certification login no userid', function(done){
    agent.post(BASE + '/login')
      .send({
        password: 'password01',
      }).end(function (err, res) {
        expect(err).to.be.empty;
        var payload = res.body;
        expect(payload).to.be.a('Object');
        expect(payload).to.have.property('login').with.false;
        expect(payload).to.have.property('message').with.equal('You need userid.');
        done();
      });
  });

  it('certification login no password', function(done){
    agent.post(BASE + '/login')
      .send({
        userid: 'matsumoto',
      }).end(function (err, res) {
        expect(err).to.be.empty;
        var payload = res.body;
        expect(payload).to.be.a('Object');
        expect(payload).to.have.property('login').with.false;
        expect(payload).to.have.property('message').with.equal('You need password.');
        done();
      });
  });

  it('certification check success', function(done){
    agent.post(BASE + '/check')
      .send({
        userid: 'sato',
      }).end(function (err, res) {
        expect(err).to.be.empty;
        var payload = res.body;
        expect(payload).to.be.a('Object');
        expect(payload).to.have.property('check').with.true;
        expect(payload).to.have.property('message').with.equal('userid sato is not exist.');
        done();
      });
  });

  it('certification check fault', function(done){
    agent.post(BASE + '/check')
      .send({
        userid: 'matsumoto',
      }).end(function (err, res) {
        expect(err).to.be.empty;
        var payload = res.body;
        expect(payload).to.be.a('Object');
        expect(payload).to.have.property('check').with.false;
        expect(payload).to.have.property('message').with.equal('userid matsumoto is already exist.');
        done();
      });
  });

});

