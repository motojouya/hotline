'use strict'

var childProcess = require('child_process');
var chai = require('chai');
var http = require('http');
var agent = require('superagent');
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

describe('certification', function () {

  before(function (done) {
    exec(PSQL + ' -f ' + __dirname + '/data.sql', function (error, stdout, stderr) {
      console.log('before test certification. has error?: ', error);
      done();
    });
  });

  after(function (done) {
    exec(PSQL + ' -f ' + __dirname + '/truncate.sql', function (error, stdout, stderr) {
      console.log('after test certification. has error?: ', error);
      done();
    });
  });

  it('certification check success', function(done){
    agent.get(BASE + '/check')
      .query({
        userid: 'testuser',
      }).end(function (err, res) {
        expect(err).to.be.null;
        var payload = res.body;
        expect(payload).to.be.a('Object');
        expect(payload).to.have.property('exist').with.false;
        done();
      });
  });

  it('certification check fault', function(done){
    agent.get(BASE + '/check')
      .query({
        userid: 'testuser01',
      }).end(function (err, res) {
        expect(err).to.be.null;
        var payload = res.body;
        expect(payload).to.be.a('Object');
        expect(payload).to.have.property('exist').with.true;
        done();
      });
  });

  it('certification login success', function(done){
    agent.post(BASE + '/login')
      .send({
        userid: 'testuser01',
        password: 'pw01',
      }).end(function (err, res) {
        expect(err).to.be.null;
        var payload = res.body;
        expect(payload).to.be.a('Object');
        expect(payload).to.have.property('login').with.true;
        var config = payload.config;
        expect(config).to.be.a('Object');
        expect(config).to.have.property('userid').with.be.a('String');
        expect(config).to.have.property('userid').with.equal('testuser01');
        expect(config).to.have.property('email').with.be.a('String');
        expect(config).to.have.property('email').with.equal('testuser01@gmail.com');
        expect(config).to.have.property('name').with.be.a('String');
        expect(config).to.have.property('name').with.equal('試験 零一');
        expect(config).to.have.property('countersign').with.be.a('String');
        expect(config).to.have.property('countersign').with.equal('cs01');
        expect(config).to.have.property('active').with.be.a('Boolean');
        expect(config).to.have.property('active').with.true;
        expect(config).to.have.property('color').with.be.a('Number');
        expect(config).to.have.property('color').with.equal(7);
        expect(config).to.have.property('notification').with.be.a('String');
        expect(config).to.have.property('notification').with.equal('UNLESS');
        expect(config).to.have.property('registered_at').with.be.a('String');
        expect(config).to.have.property('registered_at').with.exist;
        expect(config).to.have.property('thumbnail').with.be.a('String');
        expect(config).to.have.property('thumbnail').with.equal('/app/img/test.jpg');
        done();
      });
  });

  it('certification login success with onetime password', function(done){
    agent.post(BASE + '/login')
      .send({
        userid: 'testuser01',
        password: 'pw01',
        onetime_password: 'ot01',
      }).end(function (err, res) {
        expect(err).to.be.null;
        var payload = res.body;
        expect(payload).to.be.a('Object');
        expect(payload).to.have.property('login').with.true;
        var config = payload.config;
        expect(config).to.be.a('Object');
        expect(config).to.have.property('userid').with.be.a('String');
        expect(config).to.have.property('userid').with.equal('testuser01');
        expect(config).to.have.property('email').with.be.a('String');
        expect(config).to.have.property('email').with.equal('testuser01@gmail.com');
        expect(config).to.have.property('name').with.be.a('String');
        expect(config).to.have.property('name').with.equal('試験 零一');
        expect(config).to.have.property('countersign').with.be.a('String');
        expect(config).to.have.property('countersign').with.equal('cs01');
        expect(config).to.have.property('active').with.be.a('Boolean');
        expect(config).to.have.property('active').with.true;
        expect(config).to.have.property('color').with.be.a('Number');
        expect(config).to.have.property('color').with.equal(7);
        expect(config).to.have.property('notification').with.be.a('String');
        expect(config).to.have.property('notification').with.equal('UNLESS');
        expect(config).to.have.property('registered_at').with.be.a('String');
        expect(config).to.have.property('registered_at').with.exist;
        expect(config).to.have.property('thumbnail').with.be.a('String');
        expect(config).to.have.property('thumbnail').with.equal('/app/img/test.jpg');
        done();
      });
  });

  it('certification login fault userid', function(done){
    agent.post(BASE + '/login')
      .send({
        userid: 'testuser1',
        password: 'pw01',
      }).end(function (err, res) {
        expect(err).to.be.null;
        var payload = res.body;
        expect(payload).to.be.a('Object');
        expect(payload).to.have.property('login').with.false;
        done();
      });
  });

  it('certification login fault password', function(done){
    agent.post(BASE + '/login')
      .send({
        userid: 'testuser01',
        password: 'pw10',
      }).end(function (err, res) {
        expect(err).to.be.null;
        var payload = res.body;
        expect(payload).to.be.a('Object');
        expect(payload).to.have.property('login').with.false;
        done();
      });
  });

  it('certification login fault onetime password', function(done){
    agent.post(BASE + '/login')
      .send({
        userid: 'testuser02',
        password: 'pw02',
        onetime_password: 'ot20',
      }).end(function (err, res) {
        expect(err).to.be.null;
        var payload = res.body;
        expect(payload).to.be.a('Object');
        expect(payload).to.have.property('login').with.false;
        done();
      });
  });

  it('certification login no userid', function(done){
    agent.post(BASE + '/login')
      .send({
        password: 'pw01',
      }).end(function (err, res) {
        expect(err).to.be.null;
        var payload = res.body;
        expect(payload).to.be.a('Object');
        expect(payload).to.have.property('login').with.false;
        done();
      });
  });

  it('certification login no password', function(done){
    agent.post(BASE + '/login')
      .send({
        userid: 'testuser01',
      }).end(function (err, res) {
        expect(err).to.be.null;
        var payload = res.body;
        expect(payload).to.be.a('Object');
        expect(payload).to.have.property('login').with.false;
        done();
      });
  });

  it('certification first login failure no onetime password', function(done){
    agent.post(BASE + '/login')
      .send({
        userid: 'testuser02',
        password: 'pw02',
      }).end(function (err, res) {
        expect(err).to.be.null;
        var payload = res.body;
        expect(payload).to.be.a('Object');
        expect(payload).to.have.property('login').with.false;
        done();
      });
  });

  it('certification first login success with onetime password', function(done){
    agent.post(BASE + '/login')
      .send({
        userid: 'testuser02',
        password: 'pw02',
        onetime_password: 'ot02',
      }).end(function (err, res) {
        expect(err).to.be.null;
        var payload = res.body;
        expect(payload).to.be.a('Object');
        expect(payload).to.have.property('login').with.true;
        var config = payload.config;
        expect(config).to.be.a('Object');
        expect(config).to.have.property('userid').with.be.a('String');
        expect(config).to.have.property('userid').with.equal('testuser02');
        expect(config).to.have.property('email').with.be.a('String');
        expect(config).to.have.property('email').with.equal('testuser02@gmail.com');
        expect(config).to.have.property('name').with.be.a('String');
        expect(config).to.have.property('name').with.equal('試験 零二');
        expect(config).to.have.property('countersign').with.be.a('String');
        expect(config).to.have.property('countersign').with.equal('cs02');
        expect(config).to.have.property('active').with.be.a('Boolean');
        expect(config).to.have.property('active').with.true;
        expect(config).to.have.property('color').with.be.a('Number');
        expect(config).to.have.property('color').with.equal(7);
        expect(config).to.have.property('notification').with.be.a('String');
        expect(config).to.have.property('notification').with.equal('UNLESS');
        expect(config).to.have.property('registered_at').with.be.a('String');
        expect(config).to.have.property('registered_at').with.exist;
        expect(config).to.have.property('thumbnail').with.be.a('String');
        expect(config).to.have.property('thumbnail').with.equal('/app/img/test.jpg');
        done();
      });
  });

  it('certification first login success uncorrect onetime password', function(done){
    agent.post(BASE + '/login')
      .send({
        userid: 'testuser02',
        password: 'pw02',
        onetime_password: 'ot20',
      }).end(function (err, res) {
        expect(err).to.be.null;
        var payload = res.body;
        expect(payload).to.be.a('Object');
        expect(payload).to.have.property('login').with.true;
        var config = payload.config;
        expect(config).to.be.a('Object');
        expect(config).to.have.property('userid').with.be.a('String');
        expect(config).to.have.property('userid').with.equal('testuser02');
        expect(config).to.have.property('email').with.be.a('String');
        expect(config).to.have.property('email').with.equal('testuser02@gmail.com');
        expect(config).to.have.property('name').with.be.a('String');
        expect(config).to.have.property('name').with.equal('試験 零二');
        expect(config).to.have.property('countersign').with.be.a('String');
        expect(config).to.have.property('countersign').with.equal('cs02');
        expect(config).to.have.property('active').with.be.a('Boolean');
        expect(config).to.have.property('active').with.true;
        expect(config).to.have.property('color').with.be.a('Number');
        expect(config).to.have.property('color').with.equal(7);
        expect(config).to.have.property('notification').with.be.a('String');
        expect(config).to.have.property('notification').with.equal('UNLESS');
        expect(config).to.have.property('registered_at').with.be.a('String');
        expect(config).to.have.property('registered_at').with.exist;
        expect(config).to.have.property('thumbnail').with.be.a('String');
        expect(config).to.have.property('thumbnail').with.equal('/app/img/test.jpg');
        done();
      });
  });

  it('register fault userid used', function(done){
    agent.post(BASE + '/register')
      .send({
        userid: 'testuser01',
        password: 'password',
        email: 'testuser@gmail.com',
        name: '試験 零零',
        countersign: 'countersign',
      }).end(function (err, res) {
        expect(err).to.be.null;
        var payload = res.body;
        expect(payload).to.be.a('Object');
        expect(payload).to.have.property('register').with.false;
        done();
      });
  });

  it('register fault userid empty', function(done){
    agent.post(BASE + '/register')
      .send({
        userid: '',
        password: 'password',
        email: 'testuser@gmail.com',
        name: '試験 零零',
        countersign: 'countersign',
      }).end(function (err, res) {
        expect(err).to.be.null;
        var payload = res.body;
        expect(payload).to.be.a('Object');
        expect(payload).to.have.property('register').with.false;
        done();
      });
  });

  it('register fault userid ascii', function(done){
    agent.post(BASE + '/register')
      .send({
        userid: 'testuserあ',
        password: 'password',
        email: 'testuser@gmail.com',
        name: '試験 零零',
        countersign: 'countersign',
      }).end(function (err, res) {
        expect(err).to.be.null;
        var payload = res.body;
        expect(payload).to.be.a('Object');
        expect(payload).to.have.property('register').with.false;
        done();
      });
  });

  it('register fault password empty', function(done){
    agent.post(BASE + '/register')
      .send({
        userid: 'testuser',
        password: '',
        email: 'testuser@gmail.com',
        name: '試験 零零',
        countersign: 'countersign',
      }).end(function (err, res) {
        expect(err).to.be.null;
        var payload = res.body;
        expect(payload).to.be.a('Object');
        expect(payload).to.have.property('register').with.false;
        done();
      });
  });

  it('register fault password ascii', function(done){
    agent.post(BASE + '/register')
      .send({
        userid: 'testuser',
        password: 'passwordあ',
        email: 'testuser@gmail.com',
        name: '試験 零零',
        countersign: 'countersign',
      }).end(function (err, res) {
        expect(err).to.be.null;
        var payload = res.body;
        expect(payload).to.be.a('Object');
        expect(payload).to.have.property('register').with.false;
        done();
      });
  });

  it('register fault email empty', function(done){
    agent.post(BASE + '/register')
      .send({
        userid: 'testuser',
        password: 'password',
        email: '',
        name: '試験 零零',
        countersign: 'countersign',
      }).end(function (err, res) {
        expect(err).to.be.null;
        var payload = res.body;
        expect(payload).to.be.a('Object');
        expect(payload).to.have.property('register').with.false;
        done();
      });
  });

  it('register fault email ascii', function(done){
    agent.post(BASE + '/register')
      .send({
        userid: 'testuser',
        password: 'password',
        email: 'testuser@gmail.comあ',
        name: '試験 零零',
        countersign: 'countersign',
      }).end(function (err, res) {
        expect(err).to.be.null;
        var payload = res.body;
        expect(payload).to.be.a('Object');
        expect(payload).to.have.property('register').with.false;
        done();
      });
  });

  it('register fault name', function(done){
    agent.post(BASE + '/register')
      .send({
        userid: 'testuser',
        password: 'password',
        email: 'testuser@gmail.com',
        name: '',
        countersign: 'countersign',
      }).end(function (err, res) {
        expect(err).to.be.null;
        var payload = res.body;
        expect(payload).to.be.a('Object');
        expect(payload).to.have.property('register').with.false;
        done();
      });
  });

  it('register fault countersign empty', function(done){
    agent.post(BASE + '/register')
      .send({
        userid: 'testuser',
        password: 'password',
        email: 'testuser@gmail.com',
        name: '試験 零零',
        countersign: '',
      }).end(function (err, res) {
        expect(err).to.be.null;
        var payload = res.body;
        expect(payload).to.be.a('Object');
        expect(payload).to.have.property('register').with.false;
        done();
      });
  });

  it('register fault countersign ascii', function(done){
    agent.post(BASE + '/register')
      .send({
        userid: 'testuser',
        password: 'password',
        email: 'testuser@gmail.com',
        name: '試験 零零',
        countersign: 'countersignあ',
      }).end(function (err, res) {
        expect(err).to.be.null;
        var payload = res.body;
        expect(payload).to.be.a('Object');
        expect(payload).to.have.property('register').with.false;
        done();
      });
  });

  it('register success', function(done){
    agent.post(BASE + '/register')
      .send({
        userid: 'testuser',
        password: 'password',
        email: 'testuser@gmail.com',
        name: '試験 零零',
        countersign: 'countersign',
      }).end(function (err, res) {
        expect(err).to.be.null;
        var payload = res.body;
        expect(payload).to.be.a('Object');
        expect(payload).to.have.property('register').with.true;
        done();
      });
  });

});
