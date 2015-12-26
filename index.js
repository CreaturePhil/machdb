var MongoClient = require('mongodb').MongoClient;
var deasync = require('deasync');

function MachDB(url) {
  var data = {};
  var checksum = {};
  var hasLoaded = false;

  MongoClient.connect(url, function(err, db) {
    if (err) throw new Error(err);

    db.collection('documents').find({}).toArray(function(err, docs) {
      if (err) throw new Error(err);
      if (docs.length) {
        docs.forEach(function(doc) {
          checksum[doc.name] = doc.data;
          data[doc.name] = JSON.parse(doc.data);
        });
      }
      hasLoaded = true;
      db.close();
    });
  });

  function save() {
    while (!hasLoaded) deasync.runLoopOnce();
    for (var doc in data) {
      var jsonData = JSON.stringify(data[doc]);

      if (jsonData === checksum[doc]) continue;

      checksum[doc] = jsonData;

      (function(doc, jsonData) {
        MongoClient.connect(url, function(err, db) {
          if (err) throw new Error(err);

          db.collection('documents').updateOne({name: doc},
            {$set: {data: jsonData}}, {upsert: true}, function(err) {
              if (err) throw new Error(err);
              db.close();
            });
        });
      })(doc, jsonData);
    }
  }

  function db(doc) {
    if (!data[doc]) data[doc] = {};

    return {
      get: function(key, defaultValue) {
        while (!hasLoaded) deasync.runLoopOnce();
        var value = data[doc][key];
        return typeof value === 'undefined' ? defaultValue : value;
      },

      set: function(key, value) {
        while (!hasLoaded) deasync.runLoopOnce();
        data[doc][key] = value;
        save();
        return this;
      },

      object: function() {
        while (!hasLoaded) deasync.runLoopOnce();
        return data[doc];
      }
    };
  }

  db.save = save;

  return db;
}

module.exports = MachDB;
