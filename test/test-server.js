var chai = require('chai');
var chaiHttp = require('chai-http');

global.environment = 'test';
var server = require('../server.js');
var Item = require('../models/item');
var seed = require('../db/seed');

var should = chai.should();
var app = server.app;

chai.use(chaiHttp);

describe('Shopping List', function() {
  // runs at beginning of describe block
  //beforeEach(function(done) {
  before(function(done) {
    seed.run(function() {
      done();
    });
  });
  
  // runs at end of describe block
  //afterEach(function(done) {
  after(function(done) {
    Item.remove(function() {
      done();
    });
  });
  
  it('should list items on GET', function(done) {
    chai.request(app)
        .get('/items')
        .end(function(err, res) {
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.a('array');
          res.body.should.have.length(3);
          res.body[0].should.be.a('object');
          res.body[0].should.have.property('name');
          res.body[0].name.should.be.a('string');
          res.body[0].name.should.equal('Broad beans');
          res.body[1].name.should.equal('Tomatoes');
          res.body[2].name.should.equal('Peppers');
          done();
        });
  });
  it('should add an item on POST', function(done) {
    chai.request(app)
        .post('/items')
        .send({name: 'Eggs'})
        .end(function(err, res) {
          res.should.have.status(201);
          res.should.be.json;
          res.body.should.be.a('object');
          res.body.should.have.property('name');
          res.body.name.should.be.a('string');
          res.body.name.should.equal('Eggs');
          done();
        });
  });
  // {_id: val, name: val, ...}
  // tests should NOT depend on results of other tests
  it('should edit an item on PUT', function(done) {
    // use public APIs only (vs internal Model.operation)
    //    GET /items
    //    POST /items/:id
    //    GET /items
    //
    // if implementation switches from Mongo then all tests will fail
    // then tests would have to be rewritten <-- RISK
    chai.request(app)
        .get('/items')
        .end(function(err, res) {
          var items = res.body;
      
          chai.request(app)
              .put('/items/' + items[0]._id)
              .send({name: 'Bread'})
              .end(function(err, res) {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('name');
                res.body.name.should.be.a('string');
                res.body.name.should.equal('Bread');
                done();
              });
        });
  });
  it('should delete an item on DELETE', function(done) {
    chai.request(app)
        .get('/items')
        .end(function(err, res) {
          var items = res.body;
          var itemName = items[0].name;
      
          chai.request(app)
              .delete('/items/' + items[0]._id)
              .end(function(err, res) {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('name');
                res.body.name.should.be.a('string');
                res.body.name.should.equal(itemName);
                done();
              });
        });
  });
  it('should add new item on PUT if id dne', function(done) {
    chai.request(app)
        .get('/items')
        .end(function(err, res) {
          var itemsCount = res.body.length;
      
          chai.request(app)
            .put('/items/1234abcd1234abcd1234abcd')
            .send({name: 'Onions'})
            .end(function(err, res) {
              res.should.have.status(200);
              res.should.be.json;
              res.body.should.be.a('object');
              res.body.should.have.property('name');
              res.body.name.should.be.a('string');
              res.body.name.should.equal('Onions');
            
              chai.request(app)
                .get('/items')
                .end(function(err, res) {
                  res.body.length.should.equal(itemsCount+1);
                  done();
                });
            });
        });
  });
  it('should return an error on POST with no body', function(done) {
    chai.request(app)
        .post('/items')
        .end(function(err, res) {
          res.should.have.status(400);
          done();
        });
  });
  it('should return an error on PUT with no body', function(done) {
    chai.request(app)
        .put('/items/0')
        .end(function(err, res) {
          res.should.have.status(400);
          done();
        });
  });
});