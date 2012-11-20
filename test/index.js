
/**
 * Module dependencies.
 */

var rtags = require('../lib/rtags')
  , redis = require('redis')
  , should = require('should')
  , tags = rtags.createTag('blogs')
  , db = redis.createClient();

var start = new Date;

db.flushdb(function(){
  tags
    .add('linux,kernel,linus,1991,student', 1)
    .add('memory,cpu,disk,computer,mac', 2)
    .add('kernel,process,thread,lock', 3)
    .add('synchronization,kernel,mac', 4, test);
});

function test() {
  var pending = 0;
 
  ++pending;
  tags
    .queryID('3')
    .end(function(err, ids){
      if (err) throw err;
      ids.should.include('kernel');
      ids.should.include('process');
      ids.should.include('thread');
      ids.should.include('lock');
      --pending || done();
    });
 
  ++pending;
  tags
    .queryTag('linux,linus')
    .end(function(err, ids){
      if (err) throw err;
      ids.should.eql(['1']);
      --pending || done();
    });

  ++pending;
  tags
    .queryTag('kernel')
    .end(function(err, ids){
      if (err) throw err;
      ids.should.have.length(3);
      ids.should.include('1');
      ids.should.include('3');
      ids.should.include('4');
      --pending || done();
    });

  ++pending;
  tags
    .queryID('2', '4')
    .end(function(err, ids){
      if (err) throw err;
      ids.should.eql(['mac']);
      --pending || done();
    });

  ++pending;
  tags
    .queryID('2', '3')
    .end(function(err, ids){
      if (err) throw err;
      ids.should.eql([]);
      --pending || done();
    });
/*
  ++pending;
  tags
    .remove('1', function(err){
      if (err) throw err;
      tags.queryID('1').end(function(err, ids){
        if (err) throw err;
        ids.should.be.empty;
        tags.queryTag('linux,1991').end(function(err, ids){
          if (err) throw err;
          ids.should.be.empty;
          --pending || done();
        });
      });
    });
*/
}

function done() {
  console.log();
  console.log(' tests completed in %dms', new Date - start);
  console.log();
  process.exit();
}

