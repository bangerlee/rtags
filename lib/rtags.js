
/*!
 * rtags
 * Copyright(c) 2012 bangerlee <bangerlee@gmail.com>
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

var redis = require('redis')
  , noop = function(){};
/**
 * Library version.
 */

exports.version = '0.1';

/**
 * Expose `Tag`.
 */

exports.Tag = Tag;

/**
 * Expose `QueryID`.
 */

exports.QueryID = QueryID;

/**
 * Create a redis client.
 *
 * @return {RedisClient}
 * @api public
 */

exports.createClient = function(){
  return exports.client
    || (exports.client = redis.createClient());
};

/**
 * Return a new rtags `Tag` with the given `key`.
 * 
 * @param {String} key
 * @return {Tag}
 * @api public
 */

exports.createTag = function(key){
  if(!key) throw new Error('createTag() requires a redis key for namespacing.');
  return new Tag(key);
};

/**
 * Initialize a new `Tag` with the given `key`.
 *
 * @param {String} key
 * @api public
 */

function Tag(key) {
  this.key = key;
  this.client = exports.createClient();
}

/**
 * Index the given `str` mapped to `id`.
 * 
 * @param {String} str
 * @param {Number|String} id
 * @param {Function} fn
 * @api public
 */

Tag.prototype.add = function(str, id, fn){
  var key = this.key
    , db = this.client
    , tags = str.toString().split(','); 
  
  var cmds = [];
  for(i in tags) {
    cmds.push(['sadd', key + ':tag:' + tags[i], id]);
    cmds.push(['sadd', key + ':object:' + id, tags[i]]);
  }
  db.multi(cmds).exec(fn || noop);

  return this;
};

/**
 * Initialize a new `QueryID` with the given `str`
 * and `tag` instance.
 *
 * @param {String} str
 * @param {Tag} tag
 * @api public
 */

function QueryID(str, tag) {
  this.str = str;
  this.tag = tag;
}

/**
 * Initialize a new `QueryID` with the given `str1`/`str2`
 * and `tag` instance.
 *
 * @param {String} str1 
 * @param {String} str2
 * @param {Tag} tag
 * @api private
 */

function Query2ID(str1, str2, tag) {
  this.str1 = str1;
  this.str2 = str2;
  this.tag = tag;
}

/**
 * Perform a query on the given `id` returning
 * a `QueryID` instance.
 *
 * Or perform a query on two given `id` returning
 * a `Query2ID` instance.
 *
 * @param {String} id
 * @api public
 */

Tag.prototype.queryID = function(id, options) {
  if (arguments.length === 2)
    return new Query2ID(id, arguments[1], this);
  else
    return new QueryID(id, this);
};

/**
 * Perform the query on the given `id`
 * and callback `fn(err, ids)`.
 *
 * @param {Function} fn
 * @return {Query} for chaining
 * @api public 
 */

QueryID.prototype.end = function(fn) {
  var key = this.tag.key
    , db = this.tag.client
    , queryID = this.str;

  db.multi([
    ['smembers', key + ':object:' + queryID],
  ]).exec(function(err, ids) {
    ids = ids[0];
    fn(err, ids);
  });
  
  return this; 
};

/**
 * Perform the query on two given `id`
 * and callback `fn(err, ids)`.
 *
 * @param {Function} fn
 * @return {Query} for chaining
 * @api public 
 */

Query2ID.prototype.end = function(fn) {
  var key = this.tag.key
    , db = this.tag.client
    , queryID1 = this.str1
    , queryID2 = this.str2;
  
  db.multi([
    ['sinter', key + ':object:' + queryID1, key + ':object:' + queryID2],
  ]).exec(function(err, ids) {
    ids = ids[0];
    fn(err, ids);
  });

  return this;
};
