import { action } from "mobx";

function a1() {}

action(function doSome() {
  setTimeout(function () {});
});

action("named", function doSome() {
  setTimeout(function () {});
});

action("named", function doSome() {
  setTimeout(action(function () {}));
});

class SomeClass {
  @action
  m1() {
    setTimeout(function () {});
    setTimeout(() => {});
  }

  @action("name")
  m2() {
    setTimeout(function () {});
    setTimeout(() => {});
  }

  @action("named")
  m3 = function () {
    setTimeout(function () {});
    setTimeout(() => {});
  };

  m4 = action(function () {
    setTimeout(function () {});
    setTimeout(() => {});
  });

  @action
  m5 = () => {};

  m6 = action(() => {
    setTimeout(function () {});
    setTimeout(() => {});
  });

  @action
  m7 = blabla;
}
