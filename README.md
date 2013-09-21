# someday.js

Only invoke your callback when a specific condition is met.

## About

`someday` is a small abstraction over `setTimeout()` which enables you to defer a callback until a condition is met. It manages a recursive loop, repeatedly evaluating the condition until it either returns `true`, or a timeout occurs. Then and only then will `someday` invoke your callback, allowing you to pick up where you previously left off.

## Usage

Imagine a function named `princessIsInCastle()` which returns a boolean. Normally, much to Toad's amusement, Mario is informed that his beloved princess is in fact *not* in the given castle.

Luckily for Mario, he is feeling a little more optimistic about his chances of bumping into Peach today. In his case, the condition he is interested in would be `princessIsInCastle`, and his callback might look something like this:

```javascript
function() {
	// shout it from the top of the castle
	console.log('oh yeah!');
}
```

Given these inputs, Mario can wire up `someday` using the following code snippet:

```javascript
var someday = require('someday');

new someday().when(princessIsInCastle).do(function() {
	// shout it from the top of the castle
	console.log('oh yeah!');
});
```

The instance of `someday` will then wait for `princessIsInCastle()` to return `true` before invoking the given callback.

## Options

The three available options are `name`, `timeout` and `delay`.

The `name` is used when something went wrong and `someday` needs to explain the problem to the user.

The `timeout` option is how many seconds to wait before losing hope that the given condition will ever evaluate to `true`. The default is `30`.

The `delay` option is the number of seconds between attempts to poll the given condition before trying again. The default is `1`.

## License

* MIT

See `LICENSE.md`
