var assert = require('assert');
var machdb = require('../index');
var MongoClient = require('mongodb').MongoClient;

function readJSON(cb) {
  MongoClient.connect('mongodb://localhost:27017/test', function(err, db) {
    if (err) throw new Error(err);

    db.collection('documents').find({}).toArray(function(err, docs) {
      if (err) throw new Error(err);
      if (docs.length) {
        cb(JSON.parse(docs[0].data));
      } else {
        cb({});
      }
      db.close();
    });
  });
}

describe('database', function() {
  'use strict';

  var db;

  describe('CRUD', function() {

    beforeEach(function() {
      db = machdb('mongodb://localhost:27017/test');
    });

    afterEach(function(done) {
      MongoClient.connect('mongodb://localhost:27017/test', function(err, db) {
        if (err) throw new Error(err);

        db.dropCollection('documents', function(err) {
          if (err) done(err);
          db.close();
          done();
        });
      });
    });

    it('creates', function(done) {
      db('foo').set('bar', 1);
      assert.deepEqual(db('foo').object(), {bar: 1});
      readJSON(function(data) {
        assert.deepEqual(data, {bar: 1});
        assert.equal(Object.keys(db('foo').object()).length, 1);
        done();
      });
    });

    it('reads', function(done) {
      db('foo').set('bar', 1);
      assert.equal(db('foo').get('bar'), 1);
      assert.equal(db('foo').get('baz', 0), 0);
      assert.equal(db('foo').get('bar', 0), 1);
      assert.equal(db('foo').get('boo', 2), 2);
      readJSON(function(data) {
        assert.deepEqual(data, {bar: 1});
        assert.equal(Object.keys(db('foo').object()).length, 1);
        done();
      });
    });

    it('updates', function(done) {
      db('foo').set('bar', 1);
      readJSON(function(data) {
        assert.deepEqual(data, {bar: 1});
        db('foo').set('bar', db('foo').get('bar') + 1);
        setTimeout(function() {
          readJSON(function(data) {
            assert.deepEqual(data, {bar: 2});
            assert.equal(db('foo').get('bar'), 2);
            assert.equal(Object.keys(db('foo').object()).length, 1);
            done();
          });
        }, 100);
      });
    });

    it('deletes', function(done) {
      db('foo').set('bar', 1);
      readJSON(function(data) {
        assert.deepEqual(data, {bar: 1});
        delete db('foo').object().bar;
        db.save();
        readJSON(function(data) {
          assert.deepEqual(data, {});
          assert.deepEqual(db('foo').object(), {});
          assert.equal(Object.keys(db('foo').object()).length, 0);
          done();
        });
      });
    });

  });

});
