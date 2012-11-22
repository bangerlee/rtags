# rtags

rtags is a tag management system for node.js, backed by Redis. This module could be used to storage tags of blogs, commodities, photographs, individuals in the social web, etc.

## Installation

        $ npm install rtags

## Example

The first thing you'll want to do is create a `Tag` instance, which allows you to pass a `key`, used for namespacing within Redis so that you may have several tags in the same db.

    var tag = rtags.createTag('blogs');

rtags acts against string separated with ','. The following example uses an array for our "database", containing some strings, which we add to rtags by calling `Tag#add()` padding the body of text and an id of some kind, in this case the index.

```js
var strs = [];
strs.push('travel,photography,food,music,shopping');
strs.push('music,party,food,girl');
strs.push('mac,computer,cpu,memory,disk');
strs.push('linux,kernel,linus,1991');
strs.push('kernel,process,lock,time,linux');

strs.forEach(function(str, i){ tag.add(str, i); });
```
To perform a query on an id, simply invoke `Tag#queryID()` with a string and pass a callback, which receives an array of ids when present, or an empty array otherwise.

```js
tag
  .queryID(id = '3')
  .end(function(err, ids){
    if (err) throw err;
    console.log('Tags for "%s":', id);
    var tags = ids.join(' ');
    console.log('  - %s', tags);
  });
  ```

The previous example would yield the following output:

```
Tags for "3":
  - linux kernel linus 1991
```

To perform a query on two objects to find out the tags they both have, also invoke `Tag#queryID()`, but with two strings and a callback.

```js
tag
  .queryID(id1 = '3', id2 = '4')
  .end(function(err, ids){
    if (err) throw err;
    console.log('Tags for "%s" and "%s" both have:', id1, id2);
    var tags = ids.join(' ');
    console.log('  - %s', tags);
  });
  ```

The previous example would yield the following output:

```
Tags for "3" and "4" both have:
  - kernel linux
```

To perform a query on tags, simply invoke `Tag#queryTag()`, with tags separated with ',' and a callback.


```js
tag
  .queryTag(tags = 'music,food')
  .end(function(err, ids){
    if (err) throw err;
    console.log('The objects own the "%s" tags:', tags);
    var id = ids.join(' ');
    console.log('  - %s', id);
    process.exit();
  });
  ```

The previous example would yield the following output:

```
The objects own the "music,food" tags:
  - 0 1
```

##API

```js
rtags.createTag(key)
Tag#add(tags, id[, fn])
Tag#queryID(id, fn)
Tag#queryID(id1, id2, fn)
Tag#queryTag(tags, fn)
Tag#delTag(tags, id[, fn])
Tag#remove(id[, fn])
```

Examples:

```js
var tag = rtags.createTag('blogs');
tag.add('linux,kernel', '0');
tag.add('linux,linus', '1');
tag.queryID('0').end(function(err, ids){});
tag.queryID('0', '1').end(function(err, ids){});
tag.queryTag('linux,linus').end(function(err, ids){});
tag.delTag('linux', '0');
tag.remove('1');
```

##Extras
Running examples:

```bash
$ git clone git@github.com:bangerlee/rtags.git
$ cd rtags/test
$ node index.js
```

##License (MIT)

Copyright (c) 2012, LiXin, bangerlee@gmail.com.

### Author: [LiXin][0]

[0]: http://bangerlee.blogspot.com/

