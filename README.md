# Czech Technical University JavaScript Quality Guide

This guide aims to provide the ground rules for an application's JavaScript code, such that it's highly readable and consistent across different developers on a team. The focus is put on quality and coherence across the different pieces of your application.

## tl;dr

- Stick with [standard](https://github.com/feross/standard): 2 spaces, no semicolons, single quotes.
- Use [ESLint](http://eslint.org/) with [our rules](linters/).
- Use ES6 if it is feasible.
- Avoid classes, `this`, and prototype manipulation. Stick with objects and pure functions.
- Avoid mutating state. Treat immutability as baseline.


## Modules

This style guide assumes you're using a module system such as [CommonJS][1], [AMD][2], [ES6 Modules][3], or any other kind of module system. Modules systems provide individual scoping, avoid leaks to the `global` object, and improve code base organization by **automating dependency graph generation**, instead of having to resort to manually creating multiple `<script>` tags.

Module systems also provide us with dependency injection patterns, which are crucial when it comes to testing individual components in isolation.

## Strict Mode

Put [`'use strict'`][4] at the top of your modules. Strict mode allows you to catch nonsensical behavior, discourages poor practices, and _is faster_ because it allows compilers to make certain assumptions about your code.

While this is not needed when you are using [Babel](https://babeljs.io/), it won’t hurt you either.

## Spacing

Spacing must be consistent across every file in the application. To this end, using something like [`.editorconfig`][5] configuration files is highly encouraged. Here are the defaults I suggest to get started with JavaScript indentation.

```ini
# editorconfig.org
root = true

[*]
indent_style = space
indent_size = 2
end_of_line = lf
charset = utf-8
trim_trailing_whitespace = true
insert_final_newline = true

[*.md]
trim_trailing_whitespace = false
```

**Use 2 spaces for indentation.** The `.editorconfig` file can take care of that for us and everyone will be able to create the correct spacing by pressing the tab key.

Spacing doesn't just entail indentation, but also the spaces before, after, and in between arguments of a function declaration. This kind of spacing is _typically highly irrelevant to get right_, and it'll be hard for most teams to even arrive at a scheme that will satisfy everyone.

However, we prefer this one particular style:

```js
function (a, b) {
  // your stuff
}

if (true) {
  // other stuff
} else {
  // more stuff
}
```

Try to keep these differences to a minimum, but don't put much thought to it either. [Automatic formatter](https://github.com/beautify-web/js-beautify) can get care of this for you and it will keep your punctilious coworkers happy.

Where possible, improve readability by keeping lines below the 100-character mark. Never go over 120 characters per line.

## Semicolons`;`

We prefer not to use semicolons and rely on Automatic Semicolon Insertion _(ASI)_ instead. This is also [recommended by Standard](https://github.com/feross/standard/blob/master/RULES.md#automatic-semicolon-insertion-asi).

However, you may want to keep semicolons in JavaScript if your project uses languages which require them, like Java, to reduce cognitive overhead. [Semistandard](https://github.com/Flet/semistandard) is then for you.

Regardless of your choice, a [linter](#linting) should be used to catch unnecessary or unintentional semicolons.

## Linting

Use [ESLint](http://eslint.org/) for linting your code with our [provided rules](linters/).

## Strings

Strings should always be quoted using the same quotation mark. Use `'` consistently throughout your codebase.

##### Bad

```js
var message = 'oh hai ' + name + "!"
```

##### Acceptable

```js
var message = 'oh hai ' + name + '!'
```

### ES6 Template Strings

When using Babel or ES6-compatible environment, use [template strings](https://developer.mozilla.org/docs/Web/JavaScript/Reference/template_strings).

##### Better

```js
let message = `oh hai ${name}!`
```

## Variable Declaration

Always declare variables in a consistent manner, and at the top of their scope. Keeping variable declarations to _one per line is encouraged_. Always use one `var` statement for each assignment.

##### Bad

```js
var foo = 1,
    bar = 2

var baz
var pony

var a
  , b
```

```js
var foo = 1

if (foo > 1) {
  var bar = 2
}
```

##### Good

```js
var foo = 1
var bar = 2

var baz
var pony

var a
var b
```

```js
var foo = 1
var bar

if (foo > 1) {
  bar = 2
}
```

Variable declarations that aren't immediately assigned a value are acceptable to share the same line of code.

##### Acceptable

```js
var a = 'a'
var b = 2
var i, j
```

### ES6 `const` and `let`

When using Babel or ES6-compatible environment, **do not use `var`**. Use `const` to prevent reassignment of variables. If you need to mutate variables, use `let`.

<!-- TODO: Examples -->

## Conditionals

**Brackets are enforced**. This, together with a reasonable spacing strategy will help you avoid mistakes such as [Apple's SSL/TLS bug][14].

##### Bad

```js
if (err) throw err
```

##### Good

```js
if (err) { throw err }
```

It's even better if you avoid keeping conditionals on a single line, for the sake of text comprehension.

##### Better

```js
if (err) {
  throw err
}
```

## Equality

Avoid using `==` and `!=` operators, always favor `===` and `!==`. These operators are called the “strict equality operators,” while [their counterparts will attempt to cast the operands][15] into the same value type.

##### Bad

```js
function isEmptyString (text) {
  return text == ''
}

isEmptyString(0)
// <- true
```

##### Good

```js
function isEmptyString (text) {
  return text === ''
}

isEmptyString(0)
// <- false
```

There is one exception: use `==` and `!=` to check for `null` _or_ `undefined` values in one statement.

##### Bad

```js
if (text === null || text === undefined) {
  console.log('text is null or undefined')
}
```

##### Good

```js
if (text == null) {
  console.log('text is null or undefined')
}
```

<!-- TODO: note about truthy and falsey conditionals -->

## Ternary Operators

Ternary operators are fine for clear-cut conditionals, but unacceptable for confusing choices. As a rule, if you can't eye-parse it as fast as your brain can interpret the text that declares the ternary operator, chances are it's probably too complicated for its own good.

jQuery is a prime example of a codebase that's [**filled with nasty ternary operators**][16].

##### Bad

```js
function calculate (a, b) {
  return a && b ? 11 : a ? 10 : b ? 1 : 0
}
```

##### Good

```js
function getName (mobile) {
  return mobile ? mobile.name : 'Generic Player'
}
```

In cases that may prove confusing just use `if` and `else` statements instead.

## Functions

When declaring a function, always use the [function declaration form][17] instead of [function expressions][18]. Because [hoisting][19].

##### Bad

```js
var sum = function (x, y) {
  return x + y
}
```

##### Good

```js
function sum (x, y) {
  return x + y
}
```

That being said, there's nothing wrong with function expressions that are just [currying another function][20].

##### Good

```js
var plusThree = sum.bind(null, 3)
```

Keep in mind that [function declarations will be hoisted][21] to the top of the scope so it doesn't matter the order they are declared in. That being said, you should always keep functions at the top level in a scope, and avoid placing them inside conditional statements.

##### Bad

```js
if (Math.random() > 0.5) {
  sum(1, 3)

  function sum (x, y) {
    return x + y
  }
}

```

##### Good

```js
if (Math.random() > 0.5) {
  sum(1, 3)
}

function sum (x, y) {
  return x + y
}
```

```js
function sum (x, y) {
  return x + y
}

if (Math.random() > 0.5) {
  sum(1, 3)
}
```

If you need a _"no-op"_ method you can use either `Function.prototype`, or `function noop () {}`. Ideally a single reference to `noop` is used throughout the application.

Whenever you have to manipulate an array-like object, cast it to an array.

##### Bad

```js
var divs = document.querySelectorAll('div')

for (i = 0; i < divs.length; i++) {
  console.log(divs[i].innerHTML)
}
```

##### Good

```js
var divs = document.querySelectorAll('div')

[].slice.call(divs).forEach(function (div) {
  console.log(div.innerHTML)
})
```

However, be aware that there is a [substantial performance hit][22] in V8 environments when using this approach on `arguments`. If performance is a major concern, avoid casting `arguments` with `slice` and instead use a `for` loop.

#### Bad
```js
var args = [].slice.call(arguments)
```

#### Good
```js
var i
var args = new Array(arguments.length)
for (i = 0; i < args.length; i++) {
    args[i] = arguments[i]
}
```

Don't declare functions inside of loops.

##### Bad

```js
var values = [1, 2, 3]
var i

for (i = 0; i < values.length; i++) {
  setTimeout(function () {
    console.log(values[i])
  }, 1000 * i)
}
```

```js
var values = [1, 2, 3]
var i

for (i = 0; i < values.length; i++) {
  setTimeout(function (i) {
    return function () {
      console.log(values[i])
    }
  }(i), 1000 * i)
}
```

##### Good

```js
var values = [1, 2, 3]
var i

for (i = 0; i < values.length; i++) {
  setTimeout(function (i) {
    console.log(values[i])
  }, 1000 * i, i)
}
```

```js
var values = [1, 2, 3]
var i

for (i = 0; i < values.length; i++) {
  wait(i)
}

function wait (i) {
  setTimeout(function () {
    console.log(values[i])
  }, 1000 * i)
}
```

Or even better, just use `.forEach` which doesn't have the same caveats as declaring functions in `for` loops.

##### Better

```js
[1, 2, 3].forEach(function (value, i) {
  setTimeout(function () {
    console.log(value)
  }, 1000 * i)
})
```

Whenever a method is non-trivial, make the effort to **use a named function declaration rather than an anonymous function**. This will make it easier to pinpoint the root cause of an exception when analyzing stack traces.

##### Bad

```js
function once (fn) {
  var ran = false
  return function () {
    if (ran) { return }
    ran = true
    fn.apply(this, arguments)
  }
}
```

##### Good

```js
function once (fn) {
  var ran = false
  return function run () {
    if (ran) { return }
    ran = true
    fn.apply(this, arguments)
  }
}
```

Avoid keeping indentation levels from raising more than necessary by using guard clauses instead of flowing `if` statements.

##### Bad

```js
if (car) {
  if (black) {
    if (turbine) {
      return 'batman!'
    }
  }
}
```

```js
if (condition) {
  // 10+ lines of code
}
```

##### Good

```js
if (!car) {
  return
}
if (!black) {
  return
}
if (!turbine) {
  return
}
return 'batman!'
```

```js
if (!condition) {
  return
}
// 10+ lines of code
```

## Prototypes

Hacking native prototypes should be avoided at all costs, use a method instead. If you must extend the functionality in a native type, try using something like [poser][23] instead.

##### Bad

```js
String.prototype.half = function () {
  return this.substr(0, this.length / 2)
}
```

##### Good

```js
function half (text) {
  return text.substr(0, text.length / 2)
}
```

**Avoid prototypical inheritance models** unless you have a very good _performance reason_ to justify yourself.

- Prototypical inheritance boosts puts need for `this` through the roof
- It's way more verbose than using plain objects
- It causes headaches when creating `new` objects
- Needs a closure to hide valuable private state of instances
- Just use plain objects instead

## Object Literals

Instantiate using the egyptian notation `{}`. Use factories instead of constructors, here's a proposed pattern for you to implement objects in general.

```js
function util (options) {
  // private methods and state go here
  var foo

  function add () {
    return foo++
  }

  function reset () { // note that this method isn't publicly exposed
    foo = options.start || 0
  }

  reset()

  return {
    // public interface methods go here
    uuid: add
  }
}
```

## Array Literals

Instantiate using the square bracketed notation `[]`. If you have to declare a fixed-dimension array for performance reasons then it's fine to use the `new Array(length)` notation instead.

It's about time you master array manipulation! [Learn about the basics][24]. It's way easier than you might think.

- [`.forEach`](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach)
- [`.slice`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/slice)
- [`.splice`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/splice)
- [`.join`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/join)
- [`.concat`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/concat)
- [`.unshift`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/unshift)
- [`.shift`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/shift)
- [`.push`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/push)
- [`.pop`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/pop)

Learn and abuse the functional collection manipulation methods. These are **so** worth the trouble.

- [`.filter`](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Array/filter)
- [`.map`](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Array/map)
- [`.reduce`](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce)
- [`.reduceRight`](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Array/reduceRight)
- [`.some`](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Array/some)
- [`.every`](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Array/every)
- [`.sort`](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Array/sort)
- [`.reverse`](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Array/reverse)

## Regular Expressions

Keep regular expressions in variables, don't use them inline. This will vastly improve readability.

##### Bad

```js
if (/\d+/.test(text)) {
  console.log('so many numbers!')
}
```

##### Good

```js
var numeric = /\d+/
if (numeric.test(text)) {
  console.log('so many numbers!')
}
```

Also [learn how to write regular expressions][25], and what they actually do. Then you can also [visualize them online][26].

## `console` statements

Preferably bake `console` statements into a service that can easily be disabled in production. Alternatively, don't ship any `console.log` printing statements to production distributions.

## Comments

Comments **aren't meant to explain what** the code does. Good **code is supposed to be self-explanatory**. If you're thinking of writing a comment to explain what a piece of code does, chances are you need to change the code itself. The exception to that rule is explaining what a regular expression does. Good comments are supposed to **explain why** code does something that may not seem to have a clear-cut purpose.

##### Bad

```js
// create the centered container
var p = $('<p/>')
p.center(div)
p.text('foo')
```

##### Good

```js
var container = $('<p/>')
var contents = 'foo'
container.center(parent)
container.text(contents)
megaphone.on('data', function (value) {
  container.text(value) // the megaphone periodically emits updates for container
})
```

```js
var numeric = /\d+/ // one or more digits somewhere in the string
if (numeric.test(text)) {
  console.log('so many numbers!')
}
```

Commenting out entire blocks of code _should be avoided entirely_, that's why you have version control systems in place!

## Variable Naming

Variables must have meaningful names so that you don't have to resort to commenting what a piece of functionality does. Instead, try to be expressive while succinct, and use meaningful variable names.

##### Bad

```js
function a (x, y, z) {
  return z * y / x
}
a(4, 2, 6)
// <- 3
```

##### Good

```js
function ruleOfThree (had, got, have) {
  return have * got / had
}
ruleOfThree(4, 2, 6)
// <- 3
```

## Polyfills

Where possible use the native browser implementation and include [a polyfill that provides that behavior][27] for unsupported browsers. This makes the code easier to work with and less involved in hackery to make things just work.

If you can't patch a piece of functionality with a polyfill, then [wrap all uses of the patching code][28] in a globally available method that is accessible from everywhere in the application.

## Everyday Tricks

Use `||` to define a default value. If the left-hand value is [falsy][29] then the right-hand value will be used. Be advised, that because of loose type comparison, inputs like `false`, `0`, `null` or `''` will be evaluated as falsy, and converted to default value. For strict type checking use `if (value === void 0) { value = defaultValue }`.

```js
function a (value) {
  var defaultValue = 33
  var used = value || defaultValue
}
```

Use `.bind` to [partially-apply][30] functions.

```js
function sum (a, b) {
  return a + b
}

var addSeven = sum.bind(null, 7)

addSeven(6)
// <- 13
```

Use `Array.prototype.slice.call` to cast array-like objects to true arrays.

```js
var args = Array.prototype.slice.call(arguments)
```

Use [event emitters][31] on all the things!

```js
var emitter = contra.emitter()

body.addEventListener('click', function () {
  emitter.emit('click', e.target)
})

emitter.on('click', function (elem) {
  console.log(elem)
})

// simulate click
emitter.emit('click', document.body)
```

Use `Function()` as a _"no-op"_.

```js
function (cb) {
  setTimeout(cb || Function(), 2000)
}
```

## Acknowledgements

The guide is based upon [JavaScript Quality Guide](https://github.com/bevacqua/js) by Nicolas Bevacqua and [AirBnB Style Guide](https://github.com/airbnb/javascript). Many thanks to the original authors and [countless](https://github.com/bevacqua/js/graphs/contributors) [contributors](https://github.com/airbnb/javascript/graphs/contributors).

## License

MIT

> Fork away!

  [1]: http://wiki.commonjs.org/wiki/CommonJS
  [2]: http://requirejs.org/docs/whyamd.html
  [3]: http://eviltrout.com/2014/05/03/getting-started-with-es6.html
  [4]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions_and_function_scope/Strict_mode
  [5]: http://editorconfig.org
  [6]: http://dailyjs.com/2012/12/24/javascript-survey-results/
  [7]: http://blog.izs.me/post/2353458699/an-open-letter-to-javascript-leaders-regarding
  [8]: https://github.com/mdevils/node-jscs
  [9]: http://www.jslint.com/
  [10]: https://github.com/jshint/jshint/
  [11]: https://github.com/eslint/eslint
  [12]: http://nodejs.org/api/util.html#util_util_format_format
  [13]: https://github.com/visionmedia/jade
  [14]: https://www.imperialviolet.org/2014/02/22/applebug.html
  [15]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Comparison_Operators
  [16]: https://github.com/jquery/jquery/blob/c869a1ef8a031342e817a2c063179a787ff57239/src/ajax.js#L117
  [17]: http://stackoverflow.com/q/336859/389745
  [18]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/function
  [19]: https://github.com/buildfirst/buildfirst/tree/master/ch05/04_hoisting
  [20]: http://ejohn.org/blog/partial-functions-in-javascript/
  [21]: https://github.com/buildfirst/buildfirst/tree/master/ch05/04_hoisting
  [22]: https://github.com/petkaantonov/bluebird/wiki/Optimization-killers#3-managing-arguments
  [23]: https://github.com/bevacqua/poser
  [24]: http://blog.ponyfoo.com/2013/11/19/fun-with-native-arrays
  [25]: http://blog.ponyfoo.com/2013/05/27/learn-regular-expressions
  [26]: http://www.regexper.com/#%2F%5Cd%2B%2F
  [27]: http://remysharp.com/2010/10/08/what-is-a-polyfill/
  [28]: http://blog.ponyfoo.com/2014/08/05/building-high-quality-front-end-modules
  [29]: http://james.padolsey.com/javascript/truthy-falsey/
  [30]: http://ejohn.org/blog/partial-functions-in-javascript/
  [31]: https://github.com/bevacqua/contra#%CE%BBemitterthing-options
  [32]: https://github.com/bevacqua/css
  [33]: https://github.com/bevacqua/js/issues


