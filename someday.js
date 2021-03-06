var someday = function(opts) {
	if (!opts) { var opts = {}; }
	this.timeout = opts.timeout || 30;
	this.delay = opts.delay || 1;
}

someday.prototype.when = function(condition) {
	this.condition = condition;
	if (typeof(this.callback) != 'undefined') {
		this.go();
	} else {
		return this;
	}
}

someday.prototype.do = function(callback) {
	this.callback = callback;
	if (typeof(this.condition) != 'undefined') {
		this.go();
	} else {
		return this;
	}
}

someday.prototype.go = function() {
	if (!this.start) { this.start = new Date().getTime() }
	if (this.condition()) {
		var cb = this.callback;
		this.reset();
		cb();
	} else {
		if (this.isTimedOut()) {
			var cb = this.callback;
			this.reset();
			cb(new Error('Timed out'));
		} else {
			var that = this;
			setTimeout(function() { that.go() }, this.delay * 1000);
		}
	}
}

someday.prototype.reset = function() {
	this.start = null;
	this.condition = null;
	this.callback = null;
}

someday.prototype.isTimedOut = function() {
	return (this.start + (this.timeout * 1000)) < (new Date().getTime());
}

module.exports = someday;
