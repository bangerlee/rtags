
/**
 * Module dependencies.
 */

var rtags = require('../lib/rtags')
  , redis = require('redis')
  , should = require('should')
  , tag = rtags.createTag('blogs')
  , db = redis.createClient();

var start = new Date;

db.flushdb(function(){
  tag
    .add('linux,kernel,linus,1991,student', 1)
    .add('memory,cpu,disk,computer,mac', 2)
    .add('kernel,process,thread,lock', 3)
    .add('synchronization,kernel,mac', 4, test);
});

function test() {
  var pending = 0;
 
  ++pending;
  tag
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
  tag
    .queryTag('linux,linus')
    .end(function(err, ids){
      if (err) throw err;
      ids.should.eql(['1']);
      --pending || done();
    });

  ++pending;
  tag
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
  tag
    .queryID('2', '4')
    .end(function(err, ids){
      if (err) throw err;
      ids.should.eql(['mac']);
      --pending || done();
    });

  ++pending;
  tag
    .queryID('2', '3')
    .end(function(err, ids){
      if (err) throw err;
      ids.should.eql([]);
      --pending || done();
    });

  ++pending;
  tag
    .remove('1', function(err){
      if (err) throw err;
      tag.queryID('1').end(function(err, ids){
        if (err) throw err;
        ids.should.be.empty;
        tag.queryTag('linux,1991').end(function(err, ids){
          if (err) throw err;
          ids.should.be.empty;
          --pending || done();
        });
      });
    });

  ++pending;
  tag
    .delTag('computer,mac', '2', function(err){
      if (err) throw err;
      tag.queryID('2').end(function(err, ids){
        if (err) throw err;
        ids.should.have.length(3);
        tag.queryTag('computer').end(function(err, ids){
          if (err) throw err;
          ids.should.be.empty;
          --pending || done();
        });
      });
    });
}

function done() {
  console.log();
  console.log(' tests completed in %dms', new Date - start);
  console.log();
  process.exit();
}

