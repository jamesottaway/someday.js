var someday = require('./index');

new someday({ timeout: 5 }).do(function() {
	console.log('winning!')
}).when(function() {
	var random = Math.random();
	console.log(random);
	return random < 0.01;
});