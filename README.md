# babel-plugin-mobx-deep-action

[![Build Status](https://travis-ci.org/Strate/babel-plugin-mobx-deep-action.svg?branch=master)](https://travis-ci.org/Strate/babel-plugin-mobx-deep-action)

Allow to reduce boilerplate of writing async actions.
Based on assumption, that all code createdinside an action,
should be handled as action too.

This plugin scans for all functions, marked as actions, and then marks all
nested functions, which created inside actions as actions too.

[Usage with async and generator functions](#toc-usage-async)

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
be achieved with this condifuration:

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
