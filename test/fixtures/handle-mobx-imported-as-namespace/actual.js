import * as mobx from "mobx";

function a1() {}

mobx.action(function doSome() {
  setTimeout(function () {});
});

mobx.action("named", function doSome() {
  setTimeout(function () {});
});

mobx.action("named", function doSome() {
  setTimeout(mobx.action(function () {}));
});

class SomeClass {
  @mobx.action
  m1() {
    setTimeout(function () {});
    setTimeout(() => {});
  }

  @mobx.action("name")
  m2() {
    setTimeout(function () {});
    setTimeout(() => {});
  }

  @mobx.action("named")
  m3 = function () {
    setTimeout(function () {});
    setTimeout(() => {});
  };

  m4 = mobx.action(function () {
    setTimeout(function () {});
    setTimeout(() => {});
  });

  @mobx.action
  m5 = () => {};

  m6 = mobx.action(() => {
    setTimeout(function () {});
    setTimeout(() => {});
  });

  @mobx.action
  m7 = blabla;
}
