var Someday = require('../index');
var helper = require('./helper');
var should = require('should');
var _ = require('underscore');

describe('someday', function() {
  describe('when', function() {
    it('allows do() to be chained', function() {
      new Someday().when(helper.always).do.should.be.an.instanceOf(Function);
    });

    it('triggers go() if chained after do()', function(done) {
      new Someday().do(done).when(helper.always);
    });
  });

  describe('do', function() {
    it('allows when() to be chained', function() {
      new Someday().do(helper.nothing).when.should.be.an.instanceOf(Function);
    });

    it('triggers go() if chained after when()', function(done) {
      new Someday().when(helper.always).do(done);
    });
  });

  describe('timeout', function() {
    it('defaults to 30 seconds', function() {
      new Someday().timeout.should.equal(30);
    });

    it('can be overridden', function() {
      var value = Math.random();
      new Someday({ timeout: value }).timeout.should.equal(value);
    });

    it('times out the recursive condition function', function(done) {
      var counter = 0;
      var someday = new Someday({ delay: 0.01, timeout: 0.05 });
      someday.when(function() {
        counter++;
      }).do(function() {
        counter.should.equal(6);
        done();
      });
    });

    it('passes an error to the callback', function(done) {
      var someday = new Someday({ delay: 0.001, timeout: 0.001 });
      someday.when(helper.never).do(function(error) {
        error.should.be.instanceOf(Error);
        done();
      });
    });
  });

  describe('delay', function() {
    it('defaults to 1 second', function() {
      new Someday().delay.should.equal(1);
    });

    it('can be overridden', function() {
      var value = Math.random();
      new Someday({ delay: value }).delay.should.equal(value);
    });

    it('delays the recursive condition function', function(done) {
      var ticks = [];
      var someday = new Someday({ delay: 0.01, timeout: 0.05 })
      someday.when(function() {
        var tick = new Date().getTime();
        ticks.push(tick);
      }).do(function() {
        var tick_pairs = _.initial(_.zip(ticks, _.tail(ticks)));
        _.map(tick_pairs, function(tick_pair) {
          (tick_pair[1] - tick_pair[0]).should.be.approximately(11,2);
        })
        done();
      });
    });
  });

  describe('reset', function() {
    describe('on success', function() {
      it('resets the start timestamp', function(done) {
        var someday = new Someday();
        someday.when(helper.always).do(done);
        should.not.exist(someday.start);
      });
      
      it('resets the condition', function(done) {
        var someday = new Someday();
        someday.when(helper.always).do(done);
        should.not.exist(someday.condition);
      });

      it('resets the callback', function(done) {
        var someday = new Someday();
        someday.when(helper.always).do(done);
        should.not.exist(someday.callback);
      });
    });

    describe('on timeout', function() {
      it('resets the start timestamp', function(done) {
        var someday = new Someday({ timeout: 0.001, delay: 0.001 });
        someday.when(helper.never).do(function() {
          should.not.exist(someday.start);
          done();
        });
      });
      
      it('resets the condition', function(done) {
        var someday = new Someday({ timeout: 0.001, delay: 0.001 });
        someday.when(helper.never).do(function() {
          should.not.exist(someday.condition);
          done();
        });
      });

      it('resets the callback', function(done) {
        var someday = new Someday({ timeout: 0.001, delay: 0.001 });
        someday.when(helper.never).do(function() {
          should.not.exist(someday.callback);
          done();
        });
      });
    });
  });
});