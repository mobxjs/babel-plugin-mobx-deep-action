import * as mobx from "mobx";
import { action } from "mobx";

action(function () {
  setTimeout(action(function () {}));
});

mobx.action(function () {
  setTimeout(action(function () {}));
});
