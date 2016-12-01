import { action } from "mobx";

function a1() {}

action(function doSome() {
  setTimeout(function () {});
});

action("named", function doSome() {
  setTimeout(function () {});
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

  @action
  async m8() {
    const a1 = await w1;
    const a2 = await w2;
    const a3 = await w3;
  }

  @action
  m9 = function* () {
    yield 1;
    yield 2;
  };
}
