'use strict'

var childProcess = require('child_process');
var chai = require('chai');
var http = require('http');
var superagent = require('superagent');
var SCHEME = 'http';
var HOST = process.env.APP_HOST; // '127.0.0.1'
var PORT = process.env.APP_PORT; // '8080'
var PATH = '/api/v1';
var BASE = SCHEME + '://' + HOST + ':' + PORT + PATH;

var expect = chai.expect;
var PSQL = 'psql -h ' + process.env.PG_HOST
             + ' -p ' + process.env.PG_PORT
             + ' -d ' + process.env.PG_NAME
             + ' -U ' + process.env.PG_USER;
var exec = childProcess.exec;
var certified = superagent.agent();
var unknown = superagent.agent();

describe('config', function () {

  before(function (done) {
    exec(PSQL + ' -f ' + __dirname + '/data.sql', function (error, stdout, stderr) {
      if (error) {
        console.log('before test config.', error);
        return done();
      }
      console.log('before test config. debug login.');
      certified.post(BASE + '/login')
        .send({
          userid: 'testuser01',
          password: 'pw01',
        }).end(function (err, res) {
          console.log('Exec error: ' + error);
          done();
        });
    });
  });

  after(function (done) {
    exec(PSQL + ' -f ' + __dirname + '/truncate.sql', function (error, stdout, stderr) {
      console.log('after test config. has error?: ', error);
      done();
    });
  });

  it('config get not certified', function(done){
    unknown.get(BASE + '/config').end(function (err, res) {
        expect(err).to.be.null;
        var payload = res.body;
        expect(payload).to.be.a('Object');
        expect(payload).to.have.property('auth').with.false;
        done();
    });
  });

  it('config change not certified', function(done){
    unknown
      .put(BASE + '/config')
      .send({
        name: '試験 一零',
        email: 'user01test@gmail.com',
        countersign: 'cs10',
        color: 15,
        notification: 'NEVER',
        userid: 'testuser10',
      }).end(function (err, res) {
        expect(err).to.be.null;
        var payload = res.body;
        expect(payload).to.be.a('Object');
        expect(payload).to.have.property('auth').with.be.a('Boolean');
        expect(payload).to.have.property('auth').with.false;
        done();
    });
  });

  it('password change not certified', function(done){
    unknown
      .put(BASE + '/config/password')
      .send({
        now_password: 'pw01',
        new_password: 'pw10',
      }).end(function (err, res) {
        expect(err).to.be.null;
        var payload = res.body;
        expect(payload).to.be.a('Object');
        expect(payload).to.have.property('auth').with.be.a('Boolean');
        expect(payload).to.have.property('auth').with.false;
        done();
    });
  });

  it('config get', function(done){
    certified.get(BASE + '/config').end(function (err, res) {
        expect(err).to.be.null;
        var payload = res.body;
        expect(payload).to.be.a('Object');
        expect(payload).to.have.property('userid').with.be.a('String');
        expect(payload).to.have.property('userid').with.equal('testuser01');
        expect(payload).to.have.property('email').with.be.a('String');
        expect(payload).to.have.property('email').with.equal('testuser01@gmail.com');
        expect(payload).to.have.property('name').with.be.a('String');
        expect(payload).to.have.property('name').with.equal('試験 零一');
        expect(payload).to.have.property('countersign').with.be.a('String');
        expect(payload).to.have.property('countersign').with.equal('cs01');
        expect(payload).to.have.property('active').with.be.a('Boolean');
        expect(payload).to.have.property('active').with.true;
        expect(payload).to.have.property('color').with.be.a('Number');
        expect(payload).to.have.property('color').with.equal(7);
        expect(payload).to.have.property('notification').with.be.a('String');
        expect(payload).to.have.property('notification').with.equal('UNLESS');
        expect(payload).to.have.property('registered_at').with.be.a('String');
        expect(payload).to.have.property('registered_at').with.exist;
        expect(payload).to.have.property('thumbnail').with.be.a('String');
        expect(payload).to.have.property('thumbnail').with.equal('/app/img/test.jpg');
        done();
    });
  });

  it('config password fault same', function(done){
    certified
      .put(BASE + '/config/password')
      .send({
        now_password: 'pw01',
        new_password: 'pw01',
      }).end(function (err, res) {
        expect(err).to.be.null;
        var payload = res.body;
        expect(payload).to.be.a('Object');
        expect(payload).to.have.property('change').with.be.a('Boolean');
        expect(payload).to.have.property('change').with.false;
        done();
    });
  });

  it('config password fault no now', function(done){
    certified
      .put(BASE + '/config/password')
      .send({
        new_password: 'pw10',
      }).end(function (err, res) {
        expect(err).to.be.null;
        var payload = res.body;
        expect(payload).to.be.a('Object');
        expect(payload).to.have.property('change').with.be.a('Boolean');
        expect(payload).to.have.property('change').with.false;
        done();
    });
  });

  it('config password fault no new', function(done){
    certified
      .put(BASE + '/config/password')
      .send({
        now_password: 'pw01',
      }).end(function (err, res) {
        expect(err).to.be.null;
        var payload = res.body;
        expect(payload).to.be.a('Object');
        expect(payload).to.have.property('change').with.be.a('Boolean');
        expect(payload).to.have.property('change').with.false;
        done();
    });
  });

  it('password change success', function(done){
    certified
      .put(BASE + '/config/password')
      .send({
        now_password: 'pw01',
        new_password: 'pw10',
      }).end(function (err, res) {
        expect(err).to.be.null;
        var payload = res.body;
        expect(payload).to.be.a('Object');
        expect(payload).to.have.property('change').with.be.a('Boolean');
        expect(payload).to.have.property('change').with.true;
        done();
    });
  });

  it('config notification out of value', function(done){
    certified
      .put(BASE + '/config')
      .send({
        name: '試験 一零',
        email: 'user01test@gmail.com',
        countersign: 'cs10',
        color: 15,
        notification: 'ALL',
        userid: 'testuser10',
      }).end(function (err, res) {
        expect(err).to.be.null;
        var payload = res.body;
        expect(payload).to.be.a('Object');
        expect(payload).to.have.property('change').with.be.a('Boolean');
        expect(payload).to.have.property('change').with.false;
        done();
    });
  });

  it('config change none', function(done){
    certified
      .put(BASE + '/config')
      .send({
        userid: 'matumoto',
      }).end(function (err, res) {
        expect(err).to.be.null;
        var payload = res.body;
        expect(payload).to.be.a('Object');
        expect(payload).to.have.property('change').with.be.a('Boolean');
        expect(payload).to.have.property('change').with.false;
        done();
    });
  });

  it('config change success', function(done){
    certified
      .put(BASE + '/config')
      .send({
        name: '試験 一零',
        email: 'user01test@gmail.com',
        countersign: 'cs10',
        color: 15,
        notification: 'NEVER',
        userid: 'testuser10',
      }).end(function (err, res) {
        expect(err).to.be.null;
        var payload = res.body;
        expect(payload).to.be.a('Object');
        expect(payload).to.have.property('change').with.be.a('Boolean');
        expect(payload).to.have.property('change').with.true;
        var config = payload.config;
        expect(config).to.be.a('Object');
        expect(config).to.have.property('userid').with.be.a('String');
        expect(config).to.have.property('userid').with.equal('testuser01');
        expect(config).to.have.property('email').with.be.a('String');
        expect(config).to.have.property('email').with.equal('user01test@gmail.com');
        expect(config).to.have.property('name').with.be.a('String');
        expect(config).to.have.property('name').with.equal('試験 一零');
        expect(config).to.have.property('countersign').with.be.a('String');
        expect(config).to.have.property('countersign').with.equal('cs10');
        expect(config).to.have.property('active').with.be.a('Boolean');
        expect(config).to.have.property('active').with.true;
        expect(config).to.have.property('color').with.be.a('Number');
        expect(config).to.have.property('color').with.equal(15);
        expect(config).to.have.property('notification').with.be.a('String');
        expect(config).to.have.property('notification').with.equal('NEVER');
        expect(config).to.have.property('registered_at').with.be.a('String');
        expect(config).to.have.property('registered_at').with.exist;
        expect(config).to.have.property('thumbnail').with.be.a('String');
        expect(config).to.have.property('thumbnail').with.equal('/app/img/test.jpg');
        done();
    });
  });

});

