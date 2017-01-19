# babel-plugin-mobx-deep-action

[![Build Status](https://travis-ci.org/mobxjs/babel-plugin-mobx-deep-action.svg?branch=master)](https://travis-ci.org/mobxjs/babel-plugin-mobx-deep-action)
[![npm version](https://badge.fury.io/js/babel-plugin-mobx-deep-action.svg)](https://badge.fury.io/js/babel-plugin-mobx-deep-action)

Allow to reduce boilerplate of writing async actions.
Based on assumption, that all code created inside an action,
should be handled as action too.

This plugin scans for all functions, marked as actions, and then marks all
nested functions, which created inside actions as actions too.

* [Usage with async and generator functions](#toc-usage-async)
* [Typescript decorators](#toc-typescript-decorators)

## Example

**In**

```js
import { action } from "mobx";

action(function doSome() {
  fetch("/api/list").then(function(response) {
    this.items = response.dta;
  });
});
```

**Out**

```js
"use strict";

import { action } from "mobx";

action(function doSome() {
  fetch("/api/list").then(action(function(response) {
    this.items = response.dta;
  }));
});
```

## Caveats

Plugin support only ES6 imports. Only this imports are supported:
```
import {action} from "mobx";
```
```
import {action as actionAlias} from "mobx";
```
```
import * as mobx from "mobx";
```
```
import * as mobxAlias from "mobx";
```
For example, this cases are **not supported**:
```
const mobx = require("mobx")
```
```
const {action} = require("mobx")
```
```
import * as mobx from "my-mobx-alias"
```
```
import * as mobx from "mobx";
const {action} = mobx;
action(function() {});
```


## Installation

```sh
$ npm install babel-plugin-mobx-deep-action
```

## Usage

### Via `.babelrc` (Recommended)

**.babelrc**

```json
{
  "plugins": ["mobx-deep-action"]
}
```

### Via CLI

```sh
$ babel --plugins mobx-deep-action script.js
```

### Via Node API

```javascript
require("babel-core").transform("code", {
  plugins: ["mobx-deep-action"]
});
```


## <a id="toc-usage-async"></a> Usage for async and generator functions.

This plugin do nothing special for async and generator functions. So, this code
would work unexpected:

```js
@action
async function handler() {
  const items = await fetch("/api/items");
  this.items = items; // <- this line called outside an action,
                      // causing error in strict mode
}
```

To get that code worked, you should firstly apply `transform-regenerator` babel
plugin, and then this one. Unfortunatelly, beacuse of internal babel architecture,
`transform-regenerator` should be applied strictly before this plugin, which could
be achieved with this configuration:

#### .babelrc

```json5
{
  "passPerPreset": true, // this is required
  "presets": [
    {
      "plugins": ["transform-regenerator"]
    },
    {
      "plugins": ["mobx-deep-action"]
    },
    // your rest presets goes here, for example:
    "latest"
  ]
}
```

If you use decorators, you should apply `transform-decorators-legacy` inside
later preset:

#### .babelrc

```json5
{
  "passPerPreset": true, // this is required
  "presets": [
    {
      "plugins": ["transform-regenerator"]
    },
    {
      "plugins": ["mobx-deep-action"]
    },
    {
      "plugins": ["babel-plugin-transform-decorators-legacy"]
    }
    // your rest presets goes here.
  ]
}
```

## <a id="toc-typescript-decorators"></a> Typescript decorators.

This plugin could handle decorators code, emitted from typescript, such as:

```js
import * as tslib_1 from "tslib";
import { action } from "mobx";
export default class Class2 {
    async method() {
        const a = (other) => { };
        return a(function () { });
    }
}
tslib_1.__decorate([
    action
], Class2.prototype, "method", null);
```

To get this code worked, you should enable [importHelpers](https://www.typescriptlang.org/docs/handbook/compiler-options.html)
compiler option, and get [tslib](https://www.npmjs.com/package/tslib) package installed. Also, typescript
should emit es6 modules, so, you should target your compiler to es2015+. That's all,
plugin detect import from "tslib" and handle typescript decorators.
