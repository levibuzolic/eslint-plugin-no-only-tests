# eslint-plugin-no-only-tests

[![Version](https://img.shields.io/npm/v/no-only-tests.svg)](https://www.npmjs.com/package/no-only-tests)

ESLint rule for `describe.only` and `it.only` in [mocha](https://mochajs.org/) tests.

## Installation

You'll first need to install [ESLint](http://eslint.org):

```
$ npm i eslint --save-dev
```

Next, install `eslint-plugin-no-only-tests`:

```
$ npm install eslint-plugin-no-only-tests --save-dev
```

**Note:** If you installed ESLint globally (using the `-g` flag) then you must also install `eslint-plugin-no-only-tests` globally.

## Usage

Add `no-only-tests` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```json
{
  "plugins": [
    "no-only-tests"
  ]
}
```


Then configure the rules you want to use under the rules section.

```json
{
  "rules": {
    "no-only-tests/no-only-tests": 2
  }
}
```

