# MachDB [![Build Status](https://travis-ci.org/CreaturePhil/machdb.svg)](https://travis-ci.org/CreaturePhil/machdb) [![Dependency Status](https://david-dm.org/CreaturePhil/machdb.svg)](https://david-dm.org/CreaturePhil/machdb) [![devDependency Status](https://david-dm.org/CreaturePhil/machdb/dev-status.svg)](https://david-dm.org/CreaturePhil/machdb#info=devDependencies)

> Quick and easy to use database.

## Example Usage

```js
var db = require('machdb')('mongodb://localhost:27017/myproject');
db('money')
  .set('phil', 10)
  .set('some_user', db('money').get('phil') + 10);
db('seen').set('some_user', Date.now());
db('posts').set('posts', [
  { title: 'OriginDB is awesome!', body: '...', likes: 10 },
  { title: 'flexbility ', body: '...', likes: 3 },
  { title: 'something someting something', body: '...', likes: 8 }
]);
```

Database uses ``MongoDB`` to store data:

```js
{
	"_id" : ObjectId("567e4741b09bffce48aa98b1"),
	"name" : "money",
	"data" : "{\"phil\":10,\"some_user\":20}"
}
{
	"_id" : ObjectId("567e4741b09bffce48aa98b2"),
	"name" : "seen",
	"data" : "{\"some_user\":1451116353687}"
}
{
	"_id" : ObjectId("567e4741b09bffce48aa98b3"),
	"name" : "posts",
	"data" : "{\"posts\":[{\"title\":\"OriginDB is awesome!\",\"body\":\"...\",\"likes\":10},{\"title\":\"flexbility \",\"body\":\"...\",\"likes\":3},{\"title\":\"something someting something\",\"body\":\"...\",\"likes\":8}]}"
}
```

## Installation

```
$ npm install machdb --save
```

## Documentation

MachDB shares the same API as
[OriginDB](https://github.com/CreaturePhil/origindb#origindb---).
The difference between the two, is that MachDB stores data in MongoDB and
OriginDB stores data in files. The purpose of MachDB is to store data in PaaS
like Heroku or OpenShift.

## LICENSE

[MIT](LICENSE)
