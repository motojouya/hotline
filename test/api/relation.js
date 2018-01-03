'use strict';

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

describe('relation', function () {

  before(function (done) {
    exec(PSQL + ' -f ' + __dirname + '/data.sql', function (error, stdout, stderr) {
      if (error) {
        console.log('before test relation.', error);
        return done();
      }
      console.log('before test relation. debug login.');
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
      console.log('after test relation. has error?: ', error);
      done();
    });
  });

  it('relation not certified', function(done){
    unknown.get(BASE + '/relation')
      .query({
        relation_no: 3
      }).end(function (err, res) {
        expect(err).to.be.null;
        var payload = res.body;
        expect(payload).to.be.a('Object');
        expect(payload).to.have.property('auth').with.false;
        done();
      });
  });

  it('relation single result no relation_no', function(done){
    certified.get(BASE + '/relation')
      .end(function (err, res) {
        expect(err).to.be.null;
        var payload = res.body;
        expect(payload).to.be.a('Object');
        expect(payload).to.be.empty;
        done();
      });
  });

  it('relation single result relation_no nan', function(done){
    certified.get(BASE + '/relation')
      .query({
        relation_no: 'a'
      }).end(function (err, res) {
        expect(err).to.be.null;
        var payload = res.body;
        expect(payload).to.be.a('Object');
        expect(payload).to.be.empty;
        done();
      });
  });

  it('relation single result empty', function(done){
    certified.get(BASE + '/relation')
      .query({
        relation_no: 111
      }).end(function (err, res) {
        expect(err).to.be.null;
        var payload = res.body;
        expect(payload).to.be.a('Object');
        expect(payload).to.be.empty;
        done();
      });
  });

  it('relation single result', function(done){
    certified.get(BASE + '/relation')
      .query({
        relation_no: 3
      }).end(function (err, res) {
        expect(err).to.be.null;
        var payload = res.body;
        expect(payload).to.be.a('Object');
        expect(payload).to.have.property('relation_no').with.be.a('Number');
        expect(payload).to.have.property('relation_no').with.equal(3);
        expect(payload).to.have.property('userid').with.be.a('String');
        expect(payload).to.have.property('userid').with.equal('testuser03');
        expect(payload).to.have.property('name').with.be.a('String');
        expect(payload).to.have.property('name').with.equal('試験 零三');
        expect(payload).to.have.property('is_applicant').with.be.a('Boolean');
        expect(payload).to.have.property('is_applicant').with.true;
        expect(payload).to.have.property('color').with.be.a('Number');
        expect(payload).to.have.property('color').with.equal(15);
        expect(payload).to.have.property('status').with.be.a('String');
        expect(payload).to.have.property('status').with.equal('ACTIVE');
        expect(payload).to.have.property('thumbnail').with.be.a('String');
        expect(payload).to.have.property('thumbnail').with.equal('/app/img/test.jpg');
        done();
      });
  });

  it('relation single result with extra parameter', function(done){
    certified.get(BASE + '/relation')
      .query({
        relation_no: 3,
        offset: 0,
        limit: 10,
      }).end(function (err, res) {
        expect(err).to.be.null;
        var payload = res.body;
        expect(payload).to.be.a('Object');
        expect(payload).to.have.property('relation_no').with.be.a('Number');
        expect(payload).to.have.property('relation_no').with.equal(3);
        expect(payload).to.have.property('userid').with.be.a('String');
        expect(payload).to.have.property('userid').with.equal('testuser03');
        expect(payload).to.have.property('name').with.be.a('String');
        expect(payload).to.have.property('name').with.equal('試験 零三');
        expect(payload).to.have.property('is_applicant').with.be.a('Boolean');
        expect(payload).to.have.property('is_applicant').with.true;
        expect(payload).to.have.property('color').with.be.a('Number');
        expect(payload).to.have.property('color').with.equal(15);
        expect(payload).to.have.property('status').with.be.a('String');
        expect(payload).to.have.property('status').with.equal('ACTIVE');
        expect(payload).to.have.property('thumbnail').with.be.a('String');
        expect(payload).to.have.property('thumbnail').with.equal('/app/img/test.jpg');
        done();
      });
  });

  it('relation multi result no limit', function(done){
    certified.get(BASE + '/relation')
      .query({
        offset: 0,
      }).end(function (err, res) {
        expect(err).to.be.null;
        var payload = res.body;
        expect(payload).to.be.a('Object');
        expect(payload).to.be.empty;
        done();
      });
  });

  it('relation multi result no offset', function(done){
    certified.get(BASE + '/relation')
      .query({
        limit: 10,
      }).end(function (err, res) {
        expect(err).to.be.null;
        var payload = res.body;
        expect(payload).to.be.a('Object');
        expect(payload).to.be.empty;
        done();
      });
  });

  it('relation multi result limit nan', function(done){
    certified.get(BASE + '/relation')
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

  it('relation multi result offset nan', function(done){
    certified.get(BASE + '/relation')
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

  it('relation multi result first page', function(done){
    certified.get(BASE + '/relation')
      .query({
        offset: 0,
        limit: 5,
      }).end(function (err, res) {
        expect(err).to.be.null;
        var payload = res.body;
        expect(payload).to.have.property('hasNext').with.true;
        expect(payload).to.have.property('results').with.a('Array');
        expect(payload).to.have.property('results').with.lengthOf(5);
        var results = payload.results;
        for (var i = 0; i < results.length; i++) {
          expect(results[i]).to.be.a('Object');
          expect(results[i]).to.have.property('relation_no').with.be.a('Number');
          expect(results[i]).to.have.property('userid').with.be.a('String');
          expect(results[i]).to.have.property('userid').with.match(/^testuser/);
          expect(results[i]).to.have.property('name').with.be.a('String');
          expect(results[i]).to.have.property('name').with.match(/^試験/);
          expect(results[i]).to.have.property('is_applicant').with.be.a('Boolean');
          expect(results[i]).to.have.property('color').with.be.a('Number');
          expect(results[i]).to.have.property('color').with.oneOf([7, 15]);
          expect(results[i]).to.have.property('status').with.be.a('String');
          expect(results[i]).to.have.property('status').with.oneOf(['PENDING', 'ACTIVE']);
          expect(results[i]).to.have.property('thumbnail').with.be.a('String');
          expect(results[i]).to.have.property('thumbnail').with.equal('/app/img/test.jpg');
        }
        done();
      });
  });

  it('relation multi result last page', function(done){
    certified.get(BASE + '/relation')
      .query({
        offset: 5,
        limit: 5,
      }).end(function (err, res) {
        expect(err).to.be.null;
        var payload = res.body;
        expect(payload).to.have.property('hasNext').with.false;
        expect(payload).to.have.property('results').with.a('Array');
        expect(payload).to.have.property('results').with.lengthOf(4);
        var results = payload.results;
        for (var i = 0; i < payload.length; i++) {
          expect(results[i]).to.be.a('Object');
          expect(results[i]).to.have.property('relation_no').with.be.a('Number');
          expect(results[i]).to.have.property('userid').with.be.a('String');
          expect(results[i]).to.have.property('userid').with.match(/^testuser/);
          expect(results[i]).to.have.property('name').with.be.a('String');
          expect(results[i]).to.have.property('name').with.match(/^試験/);
          expect(results[i]).to.have.property('is_applicant').with.be.a('Boolean');
          expect(results[i]).to.have.property('color').with.be.a('Number');
          expect(results[i]).to.have.property('color').with.oneOf([7, 15]);
          expect(results[i]).to.have.property('status').with.be.a('String');
          expect(results[i]).to.have.property('status').with.oneOf(['PENDING', 'ACTIVE']);
          expect(results[i]).to.have.property('thumbnail').with.be.a('String');
          expect(results[i]).to.have.property('thumbnail').with.equal('/app/img/test.jpg');
        }
        done();
      });
  });

  it('relation multi result empty', function(done){
    certified.get(BASE + '/relation')
      .query({
        offset: 30,
        limit: 10,
      }).end(function (err, res) {
        expect(err).to.be.null;
        var payload = res.body;
        expect(payload).to.have.property('hasNext').with.false;
        expect(payload).to.have.property('results').with.a('Array');
        expect(payload).to.have.property('results').with.empty;
        done();
      });
  });

  it('relation not certified', function(done){
    unknown
      .post(BASE + '/relation/')
      .send({
        userid: 'testuser10',
        countersign: 'countersign',
      }).end(function (err, res) {
        expect(err).to.be.null;
        var payload = res.body;
        expect(payload).to.be.a('Object');
        expect(payload).to.have.property('auth').with.false;
        done();
      });
  });

  it('relation make fault', function(done){
    certified
      .post(BASE + '/relation/')
      .send({
        userid: 'testuser10',
        countersign: 'countersign',
      }).end(function (err, res) {
        expect(err).to.be.null;
        var payload = res.body;
        expect(payload).to.be.a('Object');
        expect(payload).to.have.property('make').with.false;
        done();
      });
  });

  it('relation make success active', function(done){
    certified
      .post(BASE + '/relation/')
      .send({
        userid: 'testuser10',
        countersign: 'cs10',
      }).end(function (err, res) {
        expect(err).to.be.null;
        var payload = res.body;
        expect(payload).to.be.a('Object');
        expect(payload).to.have.property('make').with.true;
        var relation = payload.relation;
        expect(relation).to.be.a('Object');
        expect(relation).to.have.property('relation_no').with.be.a('Number');
        expect(relation).to.have.property('relation_no').with.equal(10);
        expect(relation).to.have.property('userid').with.be.a('String');
        expect(relation).to.have.property('userid').with.equal('testuser10');
        expect(relation).to.have.property('name').with.be.a('String');
        expect(relation).to.have.property('name').with.equal('試験 一零');
        expect(relation).to.have.property('is_applicant').with.be.a('Boolean');
        expect(relation).to.have.property('is_applicant').with.false;
        expect(relation).to.have.property('color').with.be.a('Number');
        expect(relation).to.have.property('color').with.equal(7);
        expect(relation).to.have.property('status').with.be.a('String');
        expect(relation).to.have.property('status').with.equal('ACTIVE');
        expect(relation).to.have.property('thumbnail').with.be.a('String');
        expect(relation).to.have.property('thumbnail').with.equal('/app/img/test.jpg');
        done();
      });
  });

  it('relation make success pending', function(done){
    certified
      .post(BASE + '/relation/')
      .send({
        userid: 'testuser11',
        countersign: 'cs11',
      }).end(function (err, res) {
        expect(err).to.be.null;
        var payload = res.body;
        expect(payload).to.be.a('Object');
        expect(payload).to.have.property('make').with.true;
        var relation = payload.relation;
        expect(relation).to.be.a('Object');
        expect(relation).to.have.property('relation_no').with.be.a('Number');
        expect(relation).to.have.property('relation_no').with.equal(11);
        expect(relation).to.have.property('userid').with.be.a('String');
        expect(relation).to.have.property('userid').with.equal('testuser11');
        expect(relation).to.have.property('name').with.be.a('String');
        expect(relation).to.have.property('name').with.equal('試験 一一');
        expect(relation).to.have.property('is_applicant').with.be.a('Boolean');
        expect(relation).to.have.property('is_applicant').with.true;
        expect(relation).to.have.property('color').with.be.a('Number');
        expect(relation).to.have.property('color').with.equal(7);
        expect(relation).to.have.property('status').with.be.a('String');
        expect(relation).to.have.property('status').with.equal('PENDING');
        expect(relation).to.have.property('thumbnail').with.be.a('String');
        expect(relation).to.have.property('thumbnail').with.equal('/app/img/test.jpg');
        done();
      });
  });

  it('relation make no userid', function(done){
    certified
      .post(BASE + '/relation/')
      .send({
        countersign: 'downtown',
      }).end(function (err, res) {
        expect(err).to.be.null;
        var payload = res.body;
        expect(payload).to.be.a('Object');
        expect(payload).to.have.property('make').with.false;
        done();
      });
  });

  it('relation make no countersign', function(done){
    certified
      .post(BASE + '/relation/')
      .send({
        userid: 'hamada',
      }).end(function (err, res) {
        expect(err).to.be.null;
        var payload = res.body;
        expect(payload).to.be.a('Object');
        expect(payload).to.have.property('make').with.false;
        done();
      });
  });

  it('relation not certified', function(done){
    unknown
      .delete(BASE + '/relation/10')
      .end(function (err, res) {
        expect(err).to.be.null;
        var payload = res.body;
        expect(payload).to.be.a('Object');
        expect(payload).to.have.property('auth').with.false;
        done();
      });
  });

  it('relation break no resource', function(done){
    certified
      .delete(BASE + '/relation/a')
      .end(function (err, res) {
        expect(err).to.be.null;
        var payload = res.body;
        expect(payload).to.be.a('Object');
        expect(payload).to.have.property('breaks').with.false;
        done();
      });
  });

  it('relation break fault', function(done){
    certified
      .delete(BASE + '/relation/101')
      .end(function (err, res) {
        expect(err).to.be.null;
        var payload = res.body;
        expect(payload).to.be.a('Object');
        expect(payload).to.have.property('breaks').with.false;
        done();
      });
  });

  it('relation break success active', function(done){
    certified
      .delete(BASE + '/relation/10')
      .end(function (err, res) {
        expect(err).to.be.null;
        var payload = res.body;
        expect(payload).to.be.a('Object');
        expect(payload).to.have.property('breaks').with.true;
        var relation = payload.relation;
        expect(relation).to.be.a('Object');
        expect(relation).to.have.property('relation_no').with.be.a('Number');
        expect(relation).to.have.property('relation_no').with.equal(10);
        expect(relation).to.have.property('userid').with.be.a('String');
        expect(relation).to.have.property('userid').with.equal('testuser10');
        expect(relation).to.have.property('name').with.be.a('String');
        expect(relation).to.have.property('name').with.equal('試験 一零');
        expect(relation).to.have.property('is_applicant').with.be.a('Boolean');
        expect(relation).to.have.property('is_applicant').with.false;
        expect(relation).to.have.property('color').with.be.a('Number');
        expect(relation).to.have.property('color').with.equal(7);
        expect(relation).to.have.property('status').with.be.a('String');
        expect(relation).to.have.property('status').with.equal('BROKEN');
        expect(relation).to.have.property('thumbnail').with.be.a('String');
        expect(relation).to.have.property('thumbnail').with.equal('/app/img/test.jpg');
        done();
      });
  });

  it('relation break success pending', function(done){
    certified
      .delete(BASE + '/relation/11')
      .end(function (err, res) {
        expect(err).to.be.null;
        var payload = res.body;
        expect(payload).to.be.a('Object');
        expect(payload).to.have.property('breaks').with.true;
        var relation = payload.relation;
        expect(relation).to.be.a('Object');
        expect(relation).to.have.property('relation_no').with.be.a('Number');
        expect(relation).to.have.property('relation_no').with.equal(11);
        expect(relation).to.have.property('userid').with.be.a('String');
        expect(relation).to.have.property('userid').with.equal('testuser11');
        expect(relation).to.have.property('name').with.be.a('String');
        expect(relation).to.have.property('name').with.equal('試験 一一');
        expect(relation).to.have.property('is_applicant').with.be.a('Boolean');
        expect(relation).to.have.property('is_applicant').with.true;
        expect(relation).to.have.property('color').with.be.a('Number');
        expect(relation).to.have.property('color').with.equal(7);
        expect(relation).to.have.property('status').with.be.a('String');
        expect(relation).to.have.property('status').with.equal('BROKEN');
        expect(relation).to.have.property('thumbnail').with.be.a('String');
        expect(relation).to.have.property('thumbnail').with.equal('/app/img/test.jpg');
        done();
      });
  });
});

