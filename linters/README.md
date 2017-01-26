# ESLint Configuration for CTU

This is a recommended linter configuration for JavaScript projects based on [Standard](https://github.com/feross/standard) with extra rules per [our guidelines](https://github.com/cvut/javascript).

## Usage

Place [`.eslintrc.yaml`](.eslintrc.yaml) file to your project directory.

You will need the following packages:

* [eslint](http://eslint.org/)
* [eslint-config-standard](https://github.com/feross/eslint-config-standard) for basic Standard style configuration

You can install all of these as development dependencies:

```
npm install --save-dev eslint eslint-config-standard
```

### Rules Override

Modify the rules to suit your project. For example, if you have a Node-only project, you may want to remove `browser: true`  from `env`.

You can also override the rules per-file with special comments. For example you may want to specify environment for worker script in only one file:

```js
/*eslint-env worker */
```

Or you may have some custom globals:

```js
/*global var1, var2*/
```

[Learn more about ESLint configuration](http://eslint.org/docs/user-guide/configuring).

### React/JSX Projects

For projects using React and/or [JSX](https://facebook.github.io/jsx/) syntax use [standard-react](https://github.com/feross/eslint-config-standard-react).

You will need these dependencies (in addition to those above):

* [eslint-plugin-react](https://github.com/yannickcr/eslint-plugin-react) for React-specific rules.
* [eslint-config-standard-react](https://github.com/feross/eslint-config-standard-react) for React-specific configuration.

Install everything as development dependency:

```
npm install --save-dev eslint eslint-config-standard eslint-config-standard-react eslint-plugin-react
```

In your `.eslintrc.yaml` file just add `standard-react` to the `extends` property, e.g.:

```yaml
---
extends: [standard, standard-react]
# rest of the file is the same…
```

## Editor Integration

You will get the most of linting by integrating ESLint to your text editor or IDE. See [the list of integrations](http://eslint.org/docs/user-guide/integrations).

## Resources

* [Linting JavaScript in 2015](http://blog.lauritz.me/linting-javascript-in-2015/)
