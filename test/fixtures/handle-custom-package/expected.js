import { action as otherName } from "mobx-custom";

otherName(function () {
  setTimeout(otherName(function () {}));
});
