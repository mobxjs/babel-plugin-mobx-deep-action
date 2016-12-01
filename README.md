# babel-plugin-mobx-deep-action

Allow to reduce boilerplate of writing async actions. Based on assumption, that all code createdinside an action, should be handled as action too.

## Example

**In**

```js
import { action } from "mobx";

action(function doSome() {
  setTimeout(function () {});
});
```

**Out**

```js
"use strict";

import { action } from "mobx";

action(function doSome() {
  setTimeout(action(function () {});
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
