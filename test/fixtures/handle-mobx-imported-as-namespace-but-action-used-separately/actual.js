import * as mobx from "mobx";
import { action } from "mobx";

action(function() {
  setTimeout(function() {});
});

mobx.action(function() {
  setTimeout(function() {});
});
