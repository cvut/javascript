# Tooling Recommendations for JavaScript Projects

This is an overview of tools you may use in your project and (rather opinionated) guide to choosing the right set of options.

## tl;dr

- [Use Yarn and/or npm for packaging](#package-managers), avoid Bower.
- [Use Browserify](#module-bundlers) or Webpack to bundle your modules.
- [Use npm and simple scripts for task automation](#build-tools). Avoid Grunt, Gulp et al.
- [Transpile your code from ES2016 with Babel](#transpilers). Avoid opinionated languages like CoffeeScript.
- [Consider type checking in your project](#type-checking).
- [Save your time with live reloading](#live-reloading).
- [Minify your code with UglifyJS](#minification) through  bundler of your choice.
- [Use ESLint for linting](#linters).
- [Test with Tape](#testing) to keep things simple.
- [Take advantage of hosted services](#hosted-services) if your project is open-source.

![It Is Dangerous To Go Alone, Take One Of These](tooling.png)

## Package Managers

When it comes to package management in JavaScript, there is [npm](https://www.npmjs.com/) (which [_isn’t_ an acronym for “node package manager”](https://web.archive.org/web/20151125135410/https://docs.npmjs.com/misc/faq#if-npm-is-an-acronym-why-is-it-never-capitalized)) and then there are others. You will use npm to install all Node-based tools, including other package managers. However, it is perfectly okay to use npm for front-end dependencies (i.e. for browsers) – it is even [officially endorsed](http://blog.npmjs.org/post/101775448305/npm-and-front-end-packaging).

npm packages are “[CommonJS modules](https://nodejs.org/docs/latest/api/modules.html):” every module _requires_ dependencies and _exports_ stuff to be consumed by other modules. Thus your code has an obvious [dependency graph](https://en.wikipedia.org/wiki/Dependency_graph) and you don't need to pollute global namespace with your functions. The only disadvantage of npm is that you need to _bundle_ your modules to be consumed by browsers, even while you are developing the application. There are more details [in separate section](#module-bundlers).

### Consider Yarn

[Yarn](https://yarnpkg.com/) is a new dependency manager originally started by Facebook. The awesome thing about Yarn is full compatibility with npm. It works with `package.json` and it downloads all the npm packages you need. In addition, it has also following advantages:

- It is very fast,
- It has nicer CLI (for example `yarn add` works like `npm install --save`, saving you a few keystrokes),
- It manages a lockfile (`yarn.lock`) for reliable and deterministic dependency management.

[The `yarn.lock` file](https://yarnpkg.com/en/docs/yarn-lock) contains exact version and checksum of installed packages. This way the whole team has the exact same versions of dependencies and the deployments are safer.

You will likely use npm for global package installation or for `npm run`; these functions are supported by Yarn but may behave a bit differently. However, for project-level package management **Yarn is strongly recommended**.

### Avoid Bower

Another popular package manager specifically for front-end projects is [Bower](http://bower.io/). It is strictly a dependency manager: it will just download your dependencies to `bower_components` directory and the rest is up to you; usually you will place `<script>` into your HTML files for every dependency you want to use. This is fine for very small projects, but it can get out of hand very quickly.

- Dependencies between packages are not explicit, you need to manage them yourself,
- it won't help you to split your code into multiple modules,
- since there is no dependency graph, you will usually resort to passing dependencies through the global space and/or by modifying global objects (popular with jQuery plugins),
- for code minification and concatenation you will end-up with [some crazy magic comments](https://github.com/stephenplusplus/grunt-wiredep).

On the other hand, Bower does not require you to bundle your code and does not assume anything about your modules, which gives you more freedom. It is still better than manually downloading JS files and placing it into your repository, but only marginally. If you have only a few dependencies or you want to avoid compile step, you may as well [use libraries from CDN](https://cdnjs.com/).

<!--
One alternative worth mentioning is [jspm](http://jspm.io/), made specifically to work with module loader and compatible with npm registry. This may be very interesting future-facing option as more browsers gain support for HTTP/2 and ES2016 features; we will go a bit into detail in [Module Loaders](#module-loaders) section.
-->

### Recomended Reading

- [A Beginner’s Guide to npm](http://www.sitepoint.com/beginners-guide-node-package-manager/).
- [Yarn vs. npm](https://www.sitepoint.com/yarn-vs-npm/)

## Module Bundlers

Once you decide to divide your code into neat modules or tap into [npm’s huge registry](https://www.npmjs.com/), you will need to decide how to deliver your code to browsers.

Node.js supports CommonJS by default, so your server-side code will work out of the box. However, browsers don't understand `require` or `exports` in your modules. This is where _module bundler_ comes to play: it will load your _entry file_, traverse your dependency graph and spits out a single JS file, _bundle_, ready to be served to browsers.

### Webpack

[Webpack](https://webpack.js.org/) is the most popular and mature solution these days. It handles all assets, including CSS files and images. Webpack takes a “batteries-included” approach: it has a specific ecosystem and it is less composable than Browserify, but handles common use cases more easily. The possible issue with Webpack is a tight coupling with your code; since Webpack encourages you to import everything to your JS, including CSS files, the code won't work without compile step in Node. This is especially visible with its overloading of `require` by specifying loaders [directly within the code](https://webpack.js.org/loaders/#via-require). However, this practice is discouraged and not used much in practice; the recommended way is to specify your configuration in [`webpack.config.js` file](https://webpack.js.org/configuration/) outside of your code.

On the other hand, Webpack brings some significant advantages:

- It has a [live reloading server](https://webpack.js.org/guides/development/#webpack-dev-server) and supports [Hot Module Replacement](https://webpack.js.org/concepts/hot-module-replacement/).
- With [Code Splitting](https://webpack.js.org/guides/code-splitting/) you can break your JS into multiple bundles so browser progressively loads only the code it needs on the current page.
- Your JS components can be aware of CSS which helps keep your styles contained and sane (see [CSS Modules](https://github.com/css-modules/css-modules)).
- You can compile the same codebase for both browser and Node (see Universal or [“Isomorphic” JavaScript](http://isomorphic.net/)).

### Browserify

For smaller and JS-only projects consider [Browserify](http://browserify.org/); it’s very simple to use, can be nicely extended and plays well with existing Node ecosystem. While developing project, you may want to use [Watchify](https://github.com/substack/watchify), which monitors changes in your files and rebuilds the bundle for you.

### Recommended Readings

* [browserify-handbook](https://github.com/substack/browserify-handbook) (also for general introduction to CommonJS packages and modularization of your code)
* [Browserify for Webpack Users](https://gist.github.com/substack/68f8d502be42d5cd4942)
* [Browserify VS Webpack – JS Drama](http://blog.namangoel.com/browserify-vs-webpack-js-drama)

<!--
## Module Loaders
-->

## Build Tools

Now that you have some tools in your toolbelt, you surely need a task runner to manage are your build needs! Choose yours: [Grunt](http://gruntjs.com/), [Gulp](http://gulpjs.com/), [Broccoli](http://broccolijs.com/)? Or how about [Mimosa](http://mimosa.io/), [Gobble](https://github.com/gobblejs/gobble), [Brunch](http://brunch.io/), [Jake](http://jakejs.com/), [Cake](http://coffeescript.org/#cake), [Gear.js](http://gearjs.org/) or [Fly](https://git.io/fly)?

Well, you don't need any of these. [Use npm scripts](http://substack.net/task_automation_with_npm_run).

Probably the main promise of these build tools is an easy composability; you can combine your [transpiler](#transpilers) with [code minification](#minification), copy assets, publish packages etc. from one place. No need to hunt for commands with long, complicated arguments.

However [module bundlers](#module-bundlers) do most of that for us already; in the end, your fancy task runner is just a verbose way to pass configuration options to Browserify or Webpack.

Put commands you run often into `"scripts"` section of your `package.json`, for example:

```json
...
"scripts": {
  "test": "tap test/*.js",
  "build": "npm run build:js && npm run build:css",
  "build:js": "browserify index.js -o dist/index.js",
  "build:css": "cp index.css dist/index.css",
  "watch:js": "watchify index.js -o dist/index.js"
  ...
}
```

You can run these scripts with `npm run <script_name>`, e.g. `npm run build`.

If you need something complex the bundler won't do for you, like copy arbitrary files to `dist/` directory, just write a shell script.

The only advantage of task runners is a portability: the same task will work on Mac OS X, Linux, and Windows (hopefully…). Your Bash scripts won't run on Windows out of the box. The solution is to write your scripts in JavaScript as well. [ShellJS](http://documentup.com/arturadib/shelljs) provides a familiarity of *nix commands with a portability of JavaScript, use it.

> It's a Unix system, you know this!

Put your custom scripts into `script/` folder. Name them in `package.json`:

```json
"scripts": {
  "something-complicated": "node script/something-complicated.js",
  ...
}
```

If you need to run some tasks in parallel, for example a development server and a modules bundler, try [npm-run-all](https://github.com/mysticatea/npm-run-all).

### Recommended Readings

- [Task Automation with `npm run`](http://substack.net/task_automation_with_npm_run)
- [Why we should stop using Grunt & Gulp](http://blog.keithcirkel.co.uk/why-we-should-stop-using-grunt/) and [How to Use npm as a Build Tool](http://blog.keithcirkel.co.uk/how-to-use-npm-as-a-build-tool/)
- [Introducing ./task.js, THE new javascript task runner automation framework
](https://gist.github.com/substack/8313379)
- [NPM for Everything](http://beletsky.net/2015/04/npm-for-everything.html)

## Transpilers

If you think there's too many JavaScript task runners, just take a look at the [list of languages that compile to JS](https://github.com/jashkenas/coffeescript/wiki/list-of-languages-that-compile-to-JS). Honestly, most of them don't matter.

One problem with many of these languages is that they require you to learn a new syntax _in addition_ to JavaScript; it is a leaky abstraction and you might end up debugging the resulting JavaScript code. Furthermore the syntax of these languages tends to be very opinionated and your team members might have quite different preferences. And most of these options lack a proper tooling, like linter or static analysis tools.

Instead of hunting for syntactic sugar for JavaScript, focus on JavaScript and its new features, especially ES2016. Use [Babel](https://babeljs.io/) to transpile ES2016 code for backward compatibility with today browsers. Eventually these features will gain native support and we can move to transpiling ES2017.

As usual, there are exceptions to these rules. Perhaps you have a project in other language and you want to share some parts of existing codebase with browser or just reduce the mental overhead of switching between languages. Or your project has specific needs. If you are adventurous, we recommend checking out these languages which transpile to JavaScript:

- [LiveScript](http://livescript.net/) – An indirect descendant of CoffeeScript with nice functional programming features.
- [Elm](http://elm-lang.org/) – Purely functional language similar to Haskell with direct support for GUI programming, time travelling debugger and other goodies.
- [Opal](http://opalrb.org/) – Ruby to JavaScript compiler.
- [ClojureScript](https://github.com/clojure/clojurescript) – Clojure to JavaScript compiler.


### Recommended Readings

- [Transpilers: This Time It's Different](http://dailyjs.com/2015/02/26/babel/)
- [Why Babel Matters](http://codemix.com/blog/why-babel-matters)

## Type Checking

Type checking can help in a larger code base and it can also remove need for some kinds of tests we usually do to make up for the lack of strict typing. If you'd like to incorporate type annotations, check out these projects:

- [Flow](http://flowtype.org/) – Focused on soundness; you can add annotations gradually to your project, plus the checker can infer many type checks on its own.
- [TypeScript](http://www.typescriptlang.org/) – Focused on tooling and general pragmatism. Has a large collection of [external type definitions](http://definitelytyped.org/) useful for working with external JavaScript code.

### Recommended Reading

- [Flow vs. TypeScript 2.0](http://djcordhose.github.io/flow-vs-typescript/flow-typescript-2.html) by Oliver Zeigermann

## Live Reloading

Front-end development incorporates a lot of visual checking. Save your changes, switch to browser, click refresh, check the result, repeat. To reduce clicking on refresh button, you may want to use some live reload solution.

- [Browsersync](http://www.browsersync.io/) watches HTML, JS, and CSS files and reloads the browser when there is a change. It can also act as [proxy](http://www.browsersync.io/docs/command-line/#proxy-example) for non-JavaScript projects (i.e. Java or Ruby server-side sites) and synchronize your interaction (so you can test on multiple devices at once!).
- [beefy](https://github.com/chrisdickinson/beefy) is a development server for Browserify with live reloading.
- [webpack-dev-server](https://github.com/webpack/webpack-dev-server) is a similar solution for Webpack.

### Hot Module Replacement

Most live reload servers can inject CSS without reloading the whole page. What if you could do the same thing with your JavaScript code? Ideally your application would maintain exactly the same state and only replace the modules which were changed. This would be very hard without knowing where the state is located in your application. But if your code is stateless and you keep your state contained, hot module replacement may be easy to implement for you. React makes this more feasible since components have an explicit state.

Check out these solutions:

- [Webpack's Hot Module Replacement](https://webpack.github.io/docs/hot-module-replacement.html) – Webpack exposes `module.hot` object to handle hot replacement from within your modules.
- [React Hot Loader](https://gaearon.github.io/react-hot-loader/) – The original React hot reloading solution based on Webpack.
  - The author [works on a new, better solution](https://medium.com/@dan_abramov/the-death-of-react-hot-loader-765fa791d7c4).
- [LiveReactload](https://github.com/milankinen/livereactload) – Solution for Browserify.
- [Amok](http://amokjs.com/) – In browser editor with hot reloading. Great for parties.

## Minification

Code minification can improve load speed by removing comments and whitespace from your code, rename variables to shorter names, eliminate dead code etc. It should be a part of your build process before deploying code to production.

Use code minifier for the module bundler of your choice. [Minifyify](https://github.com/ben-ng/minifyify) for Browserify or [minimize option](https://webpack.github.io/docs/optimization.html#minimize) for Webpack. Both of them use [UglifyJS2](https://github.com/mishoo/UglifyJS2) for minification, which you can also use on its own.

[Closure Compiler](https://developers.google.com/closure/compiler/) may give you better results if you [annotate the code for it](https://developers.google.com/closure/compiler/docs/js-for-compiler). But unless you properly document all your code (or you use some type checker), it is probably not worth it.

## Linters

[ESLint](http://eslint.org/) is our favourite solution. It is extensible, configurable, and supports JSX and ES2016. We have [linting rules for it](../linters). Do not accept substitutes!

## Testing

Preferred test runners are [AVA](https://github.com/avajs/ava) and [Tape](https://github.com/substack/tape). Both have simple API, AVA is more feature packed and Tape is simpler.

AVA supports ES2016 syntax by default, includes Power Assert for descriptive error messages and runs code in parallel. Unfortunatelly it [doesn't run in browsers](https://github.com/avajs/ava/blob/master/docs/recipes/browser-testing.md) – yet.

Tape works both in Node and in browser and goes well with any package bundler (especially Browserify). It is the easiest option if you would like to run your tests against various browsers with [testling-ci](https://ci.testling.com/). Tape produces [TAP](https://testanything.org/) output which can be further used with some [nice summarizers](https://github.com/substack/tape#pretty-reporters). For headless testing with Tape check out [Prova](https://github.com/azer/prova).

Another popular option, especially for React applications, is [Jest](https://facebook.github.io/jest/). PayPal team has a nice write-up about [migration from AVA to Jest](https://medium.com/@kentcdodds/migrating-to-jest-881f75366e7e).

There are many testing frameworks, libraries and test runners for JavaScript. They are very similar in features and style, but each takes a bit different approach. Some of them are browser-only and some of them are very opinionated about your testing needs.

For a rough idea, there are:

- Assertion Libraries, need to be paired with framework or runner, provide helper functions for assertions and mocking:
  - [Power Assert](https://github.com/power-assert-js/power-assert) – acts like a standard `assert`, but adds extremely descriptive error messages; it works through code transformation with plugins for bundlers and Babel,
  - [Chai](http://chaijs.com) – supports various assertion styles,
  - [Sinon.js](http://sinonjs.org) – mocking, stubbing, and test spies,
  - [Should.js](https://shouldjs.github.io) – supports “BDD” syntax `should(x).be…`
  - [Expect.js](https://github.com/Automattic/expect.js) – like should, but with `expect(x)`
- Testing Frameworks, cover unit testing:
  - [Mocha](http://mochajs.org) – runner and “outer shell” for tests; bring your own assertion library,
  - [Jasmine](https://jasmine.github.io) – similar to Mocha, but with own assertions library,
  - [QUnit](https://qunitjs.com) – XUnit-style framework, originally for jQuery,
  - [Unit.js](http://unitjs.com) – Still kinda new, but with interesting features and focused on interoperability with runners and other frameworks.
- Test Runners: Make some aspects of testing easier, like running with headless browsers, automatic mocking and code injection, …:
  - [Jest](https://facebook.github.io/jest/) – Built on top of Jasmine, mocks dependencies and DOM, runs tests in parallel,
  - [Karma](https://karma-runner.github.io) – Browser-only testing which launches (headless) browser against integrated test server,
  - [Intern](https://theintern.github.io/) – Buzzword-heavy, name-dropping runner with support for both unit tests (Node and browser) and headless functional tests. Uses Chai for assertions by default.

The favourite combination seems to be Mocha, Chai and Karma, but make your own research. However, keep things simple; tests don’t provide real functionality and you should not spend too much thinking about your test stack.

### Functional Testing

Functional tests simulate user interaction and it’s a world of its own. Most projects build upon [Selenium WebDriver](http://docs.seleniumhq.org/), which lets you automate pretty much any browser. You can automate desktop browsers or special headless browsers like [PhantomJS](http://www.phantomjs.org/) and [SlimerJS](http://www.slimerjs.org/).

Given the indirection of WebDriver protocol, you can write functional tests in most languages with a proper driver. The following projects run under Node, so you can automate interaction with JavaScript.

- [Intern](https://theintern.github.io/),
- [DalekJS](http://dalekjs.com/)
- [Nightwatch.js](http://nightwatchjs.org/)
- [CasperJS](http://casperjs.org/) – instead of going through the WebDriver, it directly controls PhantomJS or SlimerJS.

You may also want to check out [projects with support for PhantomJS](http://phantomjs.org/headless-testing.html).

### Recommended Readings

- [test-anything](https://github.com/finnp/test-anything) – Interactive course in Node testing with TAP.
- [Why I use Tape Instead of Mocha & So Should You](https://medium.com/javascript-scene/why-i-use-tape-instead-of-mocha-so-should-you-6aa105d8eaf4)
- [TAP & Tape, the awesome way to test JavaScript](http://www.macwright.org/2014/03/11/tape-is-cool.html)
- [How I write tests for node and the browser](http://substack.net/how_I_write_tests_for_node_and_the_browser)
- [Jasmine vs. Mocha, Chai, and Sinon](http://thejsguy.com/2015/01/12/jasmine-vs-mocha-chai-and-sinon.html)
- [Migrating to Jest on the P2P team at PayPal](https://medium.com/@kentcdodds/migrating-to-jest-881f75366e7e#.k83d4xvgl)

## Hosted Services

If you publish your project as open-source on GitHub or in the npm registry, consider using these useful services:

- Continuous Integration (can be also used for [automatic publishing of packages](https://github.com/semantic-release/semantic-release))
  - [Travis CI](https://travis-ci.org/)
  - [Wercker](http://wercker.com/)
- Code Coverage
  - [Coveralls](https://coveralls.io/)
  - [Codecov](https://codecov.io/)
  - [Code Climate](https://codeclimate.com/)
- Static Analysis (code smell etc.)
  - [bitHound](https://www.bithound.io/)
  - [Codacy](http://codacy.com/)
  - [Code Climate](https://codeclimate.com/)
- Dependency Management (monitor dependencies of your project)
  - [David DM](https://david-dm.org/)
  - [Version Eye](https://www.versioneye.com/)
