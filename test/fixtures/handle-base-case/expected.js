import { action } from "mobx";

function a1() {}

action(function doSome() {
  setTimeout(action(function () {}));
});

action.bound(function doSome() {
  setTimeout(action(function () {}));
});

action("named", function doSome() {
  setTimeout(action(function () {}));
});

action.bound("named", function doSome() {
  setTimeout(action(function () {}));
});

action("named", function doSome() {
  setTimeout(action(function () {}));
});

class SomeClass {
  @action
  m1() {
    setTimeout(action(function () {}));
    setTimeout(action(() => {}));
  }

  @action.bound
  m1() {
    setTimeout(action(function () {}));
    setTimeout(action(() => {}));
  }

  @action("name")
  m2() {
    setTimeout(action(function () {}));
    setTimeout(action(() => {}));
  }

  @action("named")
  m3 = function () {
    setTimeout(action(function () {}));
    setTimeout(action(() => {}));
  };

  m4 = action(function () {
    setTimeout(action(function () {}));
    setTimeout(action(() => {}));
  });

  @action
  m5 = () => {};

  m6 = action(() => {
    setTimeout(action(function () {}));
    setTimeout(action(() => {}));
  });

  @action
  m7 = blabla;
}
