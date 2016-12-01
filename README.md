# babel-plugin-mobx-deep-action

Allow to reduce boilerplate of writing async actions

## Example

**In**

```js
// input code
```

**Out**

```js
"use strict";

// output code
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
