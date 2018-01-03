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

describe('voices', function () {

  before(function (done) {
    exec(PSQL + ' -f ' + __dirname + '/data.sql', function (error, stdout, stderr) {
      if (error) {
        console.log('before test voice.', error);
        return done();
      }
      console.log('before test voice. debug login.');
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
      console.log('after test voice. has error?: ', error);
      done();
    });
  });

  it('voices not certified', function(done){
    unknown.get(BASE + '/relation/2/voice')
      .query({
        offset: 0,
        limit: 10,
      }).end(function (err, res) {
        expect(err).to.be.null;
        var payload = res.body;
        expect(payload).to.be.a('Object');
        expect(payload).to.have.property('auth').with.false;
        done();
      });
  });

  it('voices empty', function(done){
    certified.get(BASE + '/relation/101/voice')
      .query({
        offset: 0,
        limit: 10,
      }).end(function (err, res) {
        expect(err).to.be.null;
        var payload = res.body;
        expect(payload).to.be.a('Object');
        expect(payload).to.have.property('hasNext').with.false;
        expect(payload).to.have.property('results').with.a('Array');
        expect(payload).to.have.property('results').with.empty;
        done();
      });
  });

  it('voices first page', function(done){
    certified.get(BASE + '/relation/2/voice')
      .query({
        offset: 0,
        limit: 10,
      }).end(function (err, res) {
        expect(err).to.be.null;
        var payload = res.body;
        expect(payload).to.be.a('Object');
        expect(payload).to.have.property('hasNext').with.true;
        expect(payload).to.have.property('results').with.a('Array');
        expect(payload).to.have.property('results').with.lengthOf(10);
        var results = payload.results;
        for (var i = 0; i < results.length; i++) {
          expect(results[i]).to.have.property('spoken_at').with.be.a('String');
          expect(results[i]).to.have.property('spoken_at').with.match(/^2017-12-11T12:/);
          if (i % 2 == 0) {
            expect(results[i]).to.have.property('userid').with.be.a('String');
            expect(results[i]).to.have.property('userid').with.equal('testuser01');
            expect(results[i]).to.have.property('sentence').with.be.a('String');
            expect(results[i]).to.have.property('sentence').with.equal('こっち');
          } else {
            expect(results[i]).to.have.property('userid').with.be.a('String');
            expect(results[i]).to.have.property('userid').with.equal('testuser02');
            expect(results[i]).to.have.property('sentence').with.be.a('String');
            expect(results[i]).to.have.property('sentence').with.equal('あっち');
          }
        }
        done();
      });
  });

  it('voices last page', function(done){
    certified.get(BASE + '/relation/2/voice')
      .query({
        offset: 10,
        limit: 10,
      }).end(function (err, res) {
        expect(err).to.be.null;
        var payload = res.body;
        expect(payload).to.have.property('hasNext').with.false;
        expect(payload).to.have.property('results').with.a('Array');
        expect(payload).to.have.property('results').with.lengthOf(5);
        var results = payload.results;
        for (var i = 0; i < results.length; i++) {
          expect(results[i]).to.have.property('spoken_at').with.be.a('String');
          expect(results[i]).to.have.property('spoken_at').with.match(/^2017-12-11T12:/);
          if (i % 2 == 0) {
            expect(results[i]).to.have.property('userid').with.be.a('String');
            expect(results[i]).to.have.property('userid').with.equal('testuser01');
            expect(results[i]).to.have.property('sentence').with.be.a('String');
            expect(results[i]).to.have.property('sentence').with.equal('こっち');
          } else {
            expect(results[i]).to.have.property('userid').with.be.a('String');
            expect(results[i]).to.have.property('userid').with.equal('testuser02');
            expect(results[i]).to.have.property('sentence').with.be.a('String');
            expect(results[i]).to.have.property('sentence').with.equal('あっち');
          }
        }
        done();
      });
  });

  it('voices over', function(done){
    certified.get(BASE + '/relation/2/voice')
      .query({
        offset: 30,
        limit: 10,
      }).end(function (err, res) {
        expect(err).to.be.null;
        var payload = res.body;
        expect(payload).to.be.a('Object');
        expect(payload).to.have.property('hasNext').with.false;
        expect(payload).to.have.property('results').with.a('Array');
        expect(payload).to.have.property('results').with.empty;
        done();
      });
  });

  it('voices no limit', function(done){
    certified.get(BASE + '/relation/2/voice')
      .query({
        offset: 0,
      }).end(function (err, res) {
        expect(err).to.be.null;
        var payload = res.body;
        expect(payload).to.be.a('Object');
        expect(payload).to.have.property('hasNext').with.false;
        expect(payload).to.have.property('results').with.a('Array');
        expect(payload).to.have.property('results').with.empty;
        done();
      });
  });

  it('voices no offset', function(done){
    certified.get(BASE + '/relation/2/voice')
      .query({
        limit: 10,
      }).end(function (err, res) {
        expect(err).to.be.null;
        var payload = res.body;
        expect(payload).to.be.a('Object');
        expect(payload).to.have.property('hasNext').with.false;
        expect(payload).to.have.property('results').with.a('Array');
        expect(payload).to.have.property('results').with.empty;
        done();
      });
  });

  it('voices limit nan', function(done){
    certified.get(BASE + '/relation/2/voice')
      .query({
        offset: 0,
        limit: 'a',
      }).end(function (err, res) {
        expect(err).to.be.null;
        var payload = res.body;
        expect(payload).to.be.a('Object');
        expect(payload).to.have.property('hasNext').with.false;
        expect(payload).to.have.property('results').with.a('Array');
        expect(payload).to.have.property('results').with.empty;
        done();
      });
  });

  it('voices offset nan', function(done){
    certified.get(BASE + '/relation/2/voice')
      .query({
        offset: 'a',
        limit: 10,
      }).end(function (err, res) {
        expect(err).to.be.null;
        var payload = res.body;
        expect(payload).to.be.a('Object');
        expect(payload).to.have.property('hasNext').with.false;
        expect(payload).to.have.property('results').with.a('Array');
        expect(payload).to.have.property('results').with.empty;
        done();
      });
  });

});
