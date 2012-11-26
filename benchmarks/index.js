
/**
 * Module dependencies.
 */

var rtags = require('../lib/rtags').createTag('rtags')
  , fs = require('fs')
  , NUM = 10000;

var str = fs.readFileSync('tags.txt', 'utf8');
var tags = str.toString().split(',');
var tags_list = []
  , i = 0
  , j = 0
  , rdm = 0;

for (;i < NUM;i++) {
  tags_list[i] = '';
  rdm = Math.floor(Math.random()*10 + 1);
  
  for (;j < rdm - 1;j++) {
    tags_list[i] += tags[Math.floor(Math.random()*1000)];
    tags_list[i] += ',' 
  } 
  tags_list[i] += tags[Math.floor(Math.random()*1000)];
  j = 1;
}

function add() {
  for (i = 0;i < NUM;i++) {
    rtags.add(tags_list[i], i); 
  } 
}

function qID() {
  rdm = Math.floor(Math.random()*NUM);
  rtags
    .queryID(rdm.toString())
    .end(function(err, ids){console.log(ids);});
}

function q2ID() {
  var rdm1 = Math.floor(Math.random()*NUM);
  var rdm2 = Math.floor(Math.random()*NUM);
  rtags
    .queryID(rdm1.toString())
    .end(function(err, ids){console.log(ids);});
}

function qTag() {
  var tag = tags[Math.floor(Math.random()*1000)];
  rtags
    .queryTag(tag)
    .end(function(err, ids){console.log(ids);});  
}

function rem() {
  for (i = 0;i < NUM;i++) {
    rtags.remove(i.toString());
  }
}

function test(str, fn) {
  var start = new Date;
  fn();
  console.log('  \033[90m%s : \033[36m%d \033[90mms\033[0m'
    , str
    , new Date - start);
}

test('add()', add);
test('queryID()', qID);
test('queryID()', q2ID);
test('queryTag()', qTag);
test('remove()', rem);
//process.exit();

