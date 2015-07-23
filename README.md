# CTU JavaScript Guide

This guide aims to provide the ground rules for an application’s JavaScript code, such that it’s highly readable and consistent across different developers on a team. The focus is put on quality and coherence across the different pieces of your application.

## tl;dr

- Stick with [standard](https://github.com/feross/standard): 2 spaces, no semicolons, single quotes.
- Use [ESLint](http://eslint.org/) with [our rules](linters/).
- Use ES6 if it is feasible.
- Avoid classes, `this`, and prototype manipulation. Stick with objects and pure functions.
- Avoid mutating state. Treat immutability as baseline.

## ES6

[Learn about ECMAScript 6](http://git.io/es6features), its new syntax and features, and use it in you project today.

For browser-oriented projects transpile your project with [Babel](https://babeljs.io/).

For server oriented projects, you can use ES6 natively in Node.js version 0.12 (with [`--harmony` flag](https://github.com/joyent/node/wiki/es6-%28a.k.a.-harmony%29-features-implemented-in-v8-and-available-in-node)) and [io.js](https://iojs.org/). Alternatively you can use [babel-node](https://babeljs.io/docs/usage/cli/#babel-node) from the Babel project. Consult [ES6 Compatibility Table](https://kangax.github.io/compat-table/es6/).

You may want to avoid Babel in smaller projects where Ethe code compilation brings unjustified overhead.

Avoid using other languages which compile to JavaScript, like CoffeeScript. While they may have more syntactic sugar and features, they are much more opinionated and not everyone may like them.

See [tooling](tooling/) for tips how to manage your build process.

## Modules

Organize your code into [modules](http://jsmodules.io/). Use [ES6 modules](http://jsmodules.io/) (with Babel) or [CommonJS](http://wiki.commonjs.org/wiki/CommonJS) (in other cases). Each module is scoped with explicit exports and does not pollute global namespace. Additionally you can easily share modules between server and browser projects.

For browser projects, you can compose modules into a single _bundle_ with tools like [Browserify](http://browserify.org/) or [Webpack](https://webpack.github.io/). See [tooling](tooling/) for more information.

Module systems also provide us with dependency injection patterns, which are crucial when it comes to testing individual components in isolation.

## Strict Mode

Put [`'use strict'`][4] at the top of your modules. Strict mode allows you to catch nonsensical behavior, discourages poor practices, and _is faster_ because it allows compilers to make certain assumptions about your code.

Babel [can do that for you](https://babeljs.io/docs/advanced/transformers/other/strict/) by default, but it won’t hurt you to keep this in mind.

## Code Style

Use [Standard](https://github.com/feross/standard) code style. You may not like some features of it, but somebody else from your team may like them – and vice versa. The point is: somebody else made these decisions for you, so you can carry on with your life and [don’t discuss what the color of the bikeshed](https://www.freebsd.org/doc/en_US.ISO8859-1/books/faq/misc.html#idp60682704).

### Indentation

Spacing must be consistent across every file in the project. Put [`.editorconfig`][5] configuration file into your project. These are recommended defaults:

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

### Spacing

Spacing doesn’t just entail indentation, but also the spaces before, after, and in between arguments of a function declaration.

The style recommended by Standard is to put space before parenthesis and after comma.

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

Get used to it and try to stick with this style, but don’t put much thought to it either. [Automatic formatter](https://github.com/beautify-web/js-beautify) can get care of this for you and it will keep your punctilious coworkers happy.

Where possible, improve readability by **keeping lines below the 100-character** mark. **Never go over 120 characters per line.**

### Brace Style

Per Standard, use the “[one true brace style](http://eslint.org/docs/rules/brace-style.html#1tbs).”

Braces are [always required for conditionals](#conditionals).

##### Bad

```js
function foo()
{
  return true;
}

if (foo)
{
  bar();
}

try
{
  somethingRisky();
} catch(e)
{
  handleError();
}

if (foo) {
  bar();
}
else {
  baz();
}
```

##### Good

```js
function foo() {
  return true;
}

if (foo) {
  bar();
}

if (foo) {
  bar();
} else {
  baz();
}

try {
  somethingRisky();
} catch(e) {
  handleError();
}
```

### Semicolons`;`

**We don't use semicolons** and we rely on Automatic Semicolon Insertion _(ASI)_ instead. While [there are some caveats](https://github.com/feross/standard/blob/master/RULES.md#automatic-semicolon-insertion-asi), you shouldn't run into them if you are not doing anything crazy in your code (and thus breaking this guide). The most notable caveat is this one:

> End of line is not treated as semicolon if the next line starts with `[`, `(`, `+` etc.

##### Bad

The following code won't work:

```js
let a = b + c
(d + e).print()
```

Linter will warn you about these exceptions. You can solve this by putting semicolon _at the beginning_ of the line:

##### Good

```js
let a = b + c
;(d + e).print()
```

However, you may want to keep using semicolons in JavaScript if your project includes languages with mandatory semicolons, like Java. [Semistandard](https://github.com/Flet/semistandard) is then for you.

Regardless of your choice, a [linter](#linting) should be used to catch unnecessary, unintentional or missing semicolons.

### Quotes

**Use single quote `'`** for quoting strings consistently throughout your codebase.

##### Bad

```js
const message = "o hai!"
```

##### Good

```js
const message = 'o hai!'
```

### Commas

**Do not use leading commas**, it’s just plain ugly.

##### Bad

```js
const story = [
    once
  , upon
  , aTime
]
```

##### Good

```js
const story = [
  once,
  upon,
  aTime,
]
```

**Use trailing commas**, it makes code diffs cleaner and modifications simpler.

##### Bad

```js
const hero = {
  firstName: 'Dana',
  lastName: 'Scully'
}

const heroes = [
  'Batman',
  'Superman'
]
```

##### Good

```js
const hero = {
  firstName: 'Dana',
  lastName: 'Scully',
}

const heroes = [
  'Batman',
  'Superman',
];
```

### Naming

Variables and functions must have meaningful names so that you don’t have to resort to commenting what a piece of functionality does. Instead, try to be expressive while succinct, and use meaningful variable names.

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

Use **camelCase** when naming objects, functions, and instances.

##### Bad

```javascript
const this_is_my_object = {}
function MYFUNCTION() {}
```

##### Good

```javascript
const thisIsMyObject = {};
function myFunction() {}
```

Use PascalCase when naming constructors (object factories) or classes.

##### Bad

```javascript
function user(options) {
  return {
    name: options.name
  }
}

const myUser = user({name: 'Ada'})
```

##### Good

```javascript
function User(options) {
  return {
    name: options.name
  }
}

const myUser = User({name: 'Ada'})
```

<!-- TODO: SCREAMING_SNAKE_CASE for constants? -->

### Variables

Always declare variables in a consistent manner, and at the top of their scope. Keeping variable declarations to _one per line is encouraged_. Always use one `const`, `let` or `var` statement for each assignment.

##### Bad

```js
const foo = 1,
      bar = 2

let baz
let pony

let a
  , b
```

```js
const foo = 1

if (foo > 1) {
  let bar = 2
}
```

##### Good

```js
const foo = 1
const bar = 2

let baz
let pony

let a
let b
```

```js
const foo = 1
let bar

if (foo > 1) {
  bar = 2
}
```

Variable declarations that aren’t immediately assigned a value are acceptable to share the same line of code.

##### Acceptable

```js
let foo, bar
```

## Linting

Use [ESLint](http://eslint.org/) for linting your code with our [provided rules](linters/).

## Strings

Use ES6 [template strings](https://developer.mozilla.org/docs/Web/JavaScript/Reference/template_strings) for strings formatting.

##### Bad

```js
const message = 'oh hai ' + name + '!'
```

##### Good

```js
const message = `oh hai ${name}!`
```

## Variables Declaration

**Avoid using `var`.** Use `const` for all of your references. While this won't prevent mutation of structures (i.e. objects or arrays), it will prevent a reassignment of the variable.

If you must mutate references, use `let` instead of `var`.

##### Bad

```js
var a = 1
var b = 1

if (true) {
  b += 1
}
```


##### Good

```js
const a = 1

let b = 1

if (true) {
  b += 1
}
```

Group declarations by their type: `const` first, `let` second.

##### Bad

```js
const a = 1
let b, c
const d = 2
```

##### Good

```js
const a = 1
const d = 2

let b, c
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

Ternary operators are fine for clear-cut conditionals, but unacceptable for confusing choices. As a rule, if you can’t eye-parse it as fast as your brain can interpret the text that declares the ternary operator, chances are it’s probably too complicated for its own good.

jQuery is a prime example of a codebase that’s [**filled with nasty ternary operators**][16].

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
let sum = function (x, y) {
  return x + y
}
```

##### Good

```js
function sum (x, y) {
  return x + y
}
```

That being said, there’s nothing wrong with function expressions that are just [currying another function][20].

##### Good

```js
const plusThree = sum.bind(null, 3)
```

Keep in mind that [function declarations will be hoisted][21] to the top of the scope so it doesn’t matter the order they are declared in. That being said, you should always keep functions at the top level in a scope, and avoid placing them inside conditional statements.

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

### Anonymous Functions

Use [arrow functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions) for simple anonymous functions.

##### Bad

```javascript
[1, 2, 3].map(function (x) {
  return x * x
});
```

##### Good

```js
[1, 2, 3].map((x) => {
  return x * x
})
```

Omit braces and parentheses if the function accepts a single argument and fits into a single line.

##### Better

```js
[1, 2, 3].map(x => x * x)
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

### Function Parameters

Learn about [default, rest, and spread parameters](https://github.com/lukehoban/es6features#default--rest--spread) in ES6.

**Never name function parameter `arguments`** since it is a reserved keyword.

##### Bad
```js
function nope(name, options, arguments) {
  // ...stuff...
}
```

##### Good
```js
function yup(name, options, args) {
  // ...stuff...
}
```

**Do not use `arguments` keyword in function.** Use rest arguments instead.

##### Bad

```js
function concatenateAll() {
  const args = Array.prototype.slice.call(arguments);
  return args.join('');
}
```

##### Good
```js
function concatenateAll(...args) {
  return args.join('');
}
```


**Use default parameter syntax** rather than mutating function arguments.

##### Bad
```js
// really bad
function handleThings(opts) {
  // No! We shouldn't mutate function arguments.
  // Double bad: if opts is falsy it'll be set to an object which may
  // be what you want but it can introduce subtle bugs.
  opts = opts || {};
  // ...
}
```

```js
// still bad
function handleThings(opts) {
  if (opts === void 0) {
    opts = {};
  }
  // ...
}
```

##### Good
```js
// good
function handleThings(opts = {}) {
  // ...
}
```

### Conditional Return

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
- It’s way more verbose than using plain objects
- It causes headaches when creating `new` objects
- Needs a closure to hide valuable private state of instances
- Just use plain objects instead

## Classes

**Avoid ES6 classes**. Since it is just a syntactic sugar over prototypal inheritance, [same caveats apply](#prototypes).

Recommended readings:

- The Two Pillars of JavaScript: [Part 1](https://medium.com/javascript-scene/the-two-pillars-of-javascript-ee6f3281e7f3) and [Part 2](https://medium.com/javascript-scene/the-two-pillars-of-javascript-pt-2-functional-programming-a63aa53a41a4).
- [How to Fix the ES6 `class` keyword](https://medium.com/javascript-scene/how-to-fix-the-es6-class-keyword-2d42bb3f4caf)
- [Think twice about ES6 classes](https://christianalfoni.github.io/javascript/2015/01/01/think-twice-about-classes.html)

Simple object factories and stateless pure functions get you usually further without all the complexity introduced by class-based object-oriented programming.

##### Bad

```js
class Point {
  constructor(x, y) {
    [this.x, this.y] = [x, y]
  }
  get x() {
    return this.x
  }
  get y() {
    return this.y
  }
}
```

##### Good

```js
function Point(x, y) {
  return Object.freeze({x, y})
}
```

## Arrays

Instantiate arrays using the square bracketed notation `[]`. If you have to declare a fixed-dimension array for performance reasons then it’s fine to use the `new Array(length)` notation instead.

### Manipulation

Whenever you have to manipulate an array-like object, cast it to an array.

##### Bad

```js
let divs = document.querySelectorAll('div')

for (i = 0; i < divs.length; i++) {
  console.log(divs[i].innerHTML)
}
```

##### Good

```js
let divs = document.querySelectorAll('div')

[].slice.call(divs).forEach((div) => {
  console.log(div.innerHTML)
})
```

### Loops

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
  setTimeout((i) => {
    return function () {
      console.log(values[i])
    }
  }(i), 1000 * i)
}
```

##### Somewhat Acceptable

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

Whenever possible, use `.forEach` instead of `for` loop. There is also no issue with declaring anonymous function within other functions.

##### Better

```js
[1, 2, 3].forEach((value, i) => {
  setTimeout(() => {
    console.log(value)
  }, 1000 * i)
})
```

### Manipulation

It’s about time you master array manipulation! [Learn about the basics][24]. It’s way easier than you might think.

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

## Objects

Instantiate using the egyptian notation `{}`.

When constructing objects, consider using [`Object.freeze`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze) to enforce immutability of the object, or at least [`Object.seal`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/seal) to maintain object's properties.

## Regular Expressions

Keep regular expressions in variables, don’t use them inline. This will vastly improve readability.

##### Bad

```js
if (/\d+/.test(text)) {
  console.log('so many numbers!')
}
```

##### Good

```js
const numeric = /\d+/
if (numeric.test(text)) {
  console.log('so many numbers!')
}
```

Also [learn how to write regular expressions][25], and what they actually do. Then you can also [visualize them online][26].

## `console` statements

Preferably bake `console` statements into a service that can easily be disabled in production. Alternatively, don’t ship any `console.log` printing statements to production distributions.

## Comments

Comments **aren’t meant to explain what** the code does. Good **code is supposed to be self-explanatory**. If you’re thinking of writing a comment to explain what a piece of code does, chances are you need to change the code itself. The exception to that rule is explaining what a regular expression does. Good comments are supposed to **explain why** code does something that may not seem to have a clear-cut purpose.

##### Bad

```js
// create the centered container
let p = $('<p/>')
p.center(div)
p.text('foo')
```

##### Good

```js
let container = $('<p/>')
let contents = 'foo'
container.center(parent)
container.text(contents)
megaphone.on('data', function (value) {
  container.text(value) // the megaphone periodically emits updates for container
})
```

```js
const numeric = /\d+/ // one or more digits somewhere in the string
if (numeric.test(text)) {
  console.log('so many numbers!')
}
```

Commenting out entire blocks of code _should be avoided entirely_, that’s why you have version control systems in place!

## Polyfills

Where possible use the native browser implementation and include [a polyfill that provides that behavior][27] for unsupported browsers. This makes the code easier to work with and less involved in hackery to make things just work.

If you can’t patch a piece of functionality with a polyfill, then [wrap all uses of the patching code][28] in a globally available method that is accessible from everywhere in the application.

## Functional Programming

While JavaScript does not emphasise any particular programming paradigm, it goes especially well with some aspects of functional programming. Learn about functional programming and embrace it in your code. While you may have heard of some scare stories about it and/or you may think it is highly impractical stuff made up by some mathematicians, the reality is quite different.

Recommended reading:

* [Professor Frisby's Mostly Adequate Guide to Functional Programming](http://drboolean.gitbooks.io/mostly-adequate-guide/)

The following section are few tips on how to start with functional style.

### Separate Data and Behaviour

**Put data into “dumb” structures and behaviour into functions.** Mainstream “object-oriented” programming languages bundle behaviour and data into classes. Many times, however, we operate with same data in different contexts. The fabulous OOP then becomes about managing inevitable complexity as we need to do various operations with same data, but classes and inheritance are extremely poor way to manage things.

If you need to do something with your data, just put them into object or array and write a simple function to do stuff. No need to write `DoStuffWithDataExecutor` class to encapsulate your data. Functions in JavaScript are first-class citizens, treat them as such.

Recommended reading: [Execution in the Kingdom of Nouns](http://steve-yegge.blogspot.cz/2006/03/execution-in-kingdom-of-nouns.html).

##### Bad

```js
class Person {
  constructor (first, last) {
    [this.first, this.last] = [first, last]
  }
  fullName () {
    return `${this.first} ${this.last}`
  }
}

let jane = new Person('Jane', 'Doe')
jane.fullName() // => 'Jane Doe'
```

##### Good

```js
function fullName (person) {
  return `${person.first} ${person.last}`
}

let jane = {
  first: 'Jane',
  last: 'Doe',
}

fullName(jane) // => 'Jane Doe'
```


### Mutability

**Avoid mutating state.** Instead of modifying the original object, return a new object with changes.

##### Bad

```js
function rename (person, newName) {
  person.name = newName
  return person
}

const jane = {name: 'Jane'}
const anna = rename(jane, 'Anna')
jane.name // => 'Anna'
anna.name // => 'Anna'
```

##### Good

```js
function rename (person, newName) {
  const clone = Object.assign({}, person)
  clone.name = newName
  return clone
}

const jane = {name: 'Jane'}
const anna = rename(jane, 'Anna')
jane.name // => 'Jane'
anna.name // => 'Anna'
```

This example uses [Object.assign](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign) which is not yet widely supported. Most utility libraries provide `extend` or `clone` function, or you can use some [standalone implementation](http://npm.im/clone).

Arrays can be efficiently manipulated through standard functional methods like [`map`](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Array/map) or [`filter`](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Array/filter) which return a new array.

##### Bad

```js
const words = ['foobar', 'baz', 'a']
const lengths = []

for (let i = 0; i < words.length; i++) {
  let len = words[i].length
  lengths.push(len)
};

lengths // => [6, 3, 1]
```

##### Bad

```js
const words = ['foobar', 'baz', 'a']
const lengths = []

words.forEach((word) => {
  lengths.push(word.length)
})

lengths // => [6, 3, 1]
```

`forEach` usually implies a side effect, in this case it is manipulating an outside array.

##### Good

```js
const words = ['foobar', 'baz', 'a']

const lengths = words.map(word => word.length)

lengths // => [6, 3, 1]
```


### Pure Functions

**Avoid side-effects and outside state.** [Pure functions](http://drboolean.gitbooks.io/mostly-adequate-guide/content/ch3.html) always return the same output given the same parameters. However, since programming without side-effects would be impossible, try to contain it in dedicated functions and keep the rest of your code pure.

##### Impure

```js
const minimum = 21;

function checkAge (age) {
  return age >= minimum;
};
```


##### Pure

```js
function checkAge (age) {
  const minimum = 21;
  return age >= minimum;
};
```


### Currying

The pure functions are easily testable and predictable. But don't fret, you won't need to pass _every single_ parameter _every time_ you call your function. With high-order functions, you can build your functions incrementally with [_currying_](http://drboolean.gitbooks.io/mostly-adequate-guide/content/ch4.html).

##### Bad
```js
function checkAge (minimumAge, age) {
  return age >= minimumAge
}

checkAge(21, 18) // => false
checkAge(18, 18) // => true
```

##### Good
```js
function ageChecker (minimumAge) {
  return function (age) {
    return age >= minimumAge
  }
}

const checkAgeUsa = ageChecker(21)
const checkAgeEu = ageChecker(18)

checkAgeUsa(18) // => false
checkAgeEu(18) // => true

// treating curried function as anonymous does not look pretty
ageChecker(21)(18) // => false
```

Many libraries provide universal curry function, e.g. [Ramda](http://ramdajs.com/docs/#curry), or you can use [a stand-alone module](http://npm.im/curry-d).

##### Better

```js
const ageChecker = curry((minimumAge, age) => {
  return age >= minimumAge
})

const checkAgeUsa = ageChecker(21)
checkAgeUsa(18) // => false

// works the same as before
ageChecker(21)(18) // => false

// but you can also pass all the parameters
ageChecker(21, 18) // => false
```

#### Parameters Order

When currying, keep the order of parameters in mind: you want to put the most variable parameter, i.e. data, as the last parameter. This allows you to easily compose functions.

For example popular libraries [Underscore](http://underscorejs.org/) and [lodash](https://lodash.com/) put data as the first parameter.

Recommended watching: [Hey Underscore, You're Doing It Wrong!](https://www.youtube.com/watch?v=m3svKOdZijA).

##### Bad

```js
function firstTwoLetters (words) {
  return _.map(words, (word) => {
    return _.take(word, 2)
  })
}

firstTwoLetters(['foo', 'bar']) // => ['fo', 'ba']
```

On the other hand, functions in [Ramda](http://ramdajs.com) are curried and take data as the last parameter, so you can keep boilerplate to minimum.

##### Good

```js
const firstTwoLetters = R.map(R.take(2))

firstTwoLetters(['foo', 'bar']) // => ['fo', 'ba']
```

### Functional Composition

Pure functions and currying are powerful tools for manipulating data. You can [compose generic functions](http://drboolean.gitbooks.io/mostly-adequate-guide/content/ch5.html) to suit your specific needs with almost none code.

Use either `compose`, or `pipe` to combine functions into new functions. The only difference is order of functions:

Compose applies functions outside-in, i.e. `compose(a, b, c)(x)` is the same as `a(b(c(x)))`; so functions are applied from _right to left_.

Pipe does the opposite, i.e. `pipe(a, b, c)(x)` is the same as `c(b(a(x)))`; functions are applied from _left to right_.

While we find `pipe` more natural, use one , but be consistent within the project.

Try to keep your functions [pointfree](http://drboolean.gitbooks.io/mostly-adequate-guide/content/ch5.html#pointfree) to make them easier to extract and reuse.

##### Bad

```js
function shout (sentence) {
  sentence.toUpperCase() + '!'
}

shout('send in the clowns') // => SEND IN THE CLOWNS!
```


##### Good

```js
function toUpperCase (str) {
  return str.toUpperCase()
}
function exclaim (str) { 
  return `${str}!`
}
const shout = pipe(toUpperCase, exclaim)

shout('send in the clowns') // => SEND IN THE CLOWNS!
```

## Acknowledgements

This guide is based upon [JavaScript Quality Guide](https://github.com/bevacqua/js) by Nicolas Bevacqua and [AirBnB Style Guide](https://github.com/airbnb/javascript). Some examples are based on [Professor Frisby's Mostly Adequate Guide to Functional Programming](http://drboolean.gitbooks.io/mostly-adequate-guide/). Many thanks to the original authors and [countless](https://github.com/bevacqua/js/graphs/contributors) [contributors](https://github.com/airbnb/javascript/graphs/contributors).

## License

MIT

> Fork away!

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


