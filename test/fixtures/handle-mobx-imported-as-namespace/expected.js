import * as mobx from "mobx";

function a1() {}

mobx.action(function doSome() {
  setTimeout(mobx.action(function () {}));
});

mobx.action("named", function doSome() {
  setTimeout(mobx.action(function () {}));
});

mobx.action("named", function doSome() {
  setTimeout(mobx.action(function () {}));
});

class SomeClass {
  @mobx.action
  m1() {
    setTimeout(mobx.action(function () {}));
    setTimeout(mobx.action(() => {}));
  }

  @mobx.action("name")
  m2() {
    setTimeout(mobx.action(function () {}));
    setTimeout(mobx.action(() => {}));
  }

  @mobx.action("named")
  m3 = function () {
    setTimeout(mobx.action(function () {}));
    setTimeout(mobx.action(() => {}));
  };

  m4 = mobx.action(function () {
    setTimeout(mobx.action(function () {}));
    setTimeout(mobx.action(() => {}));
  });

  @mobx.action
  m5 = () => {};

  m6 = mobx.action(() => {
    setTimeout(mobx.action(function () {}));
    setTimeout(mobx.action(() => {}));
  });

  @mobx.action
  m7 = blabla;
}
