import { action } from "mobx";

function a1() {}

action(function* doSome() {
  yield 1;
  yield 2;
});

action(async function doSomeSpecial() {
  await 1;
  await 2;
})

action(async () => {
  await 1;
  await 2;
});

action(async () => {
  const a = [
    await 1,
    await 2,
  ]
});

class SomeClass {
  @action
  async method() {
    await 1;
    await 2;
  }

  @action("named")
  async method1() {
    await 1;
    await 2;
  }

  @action
  generatorMethod = function* () {
    yield 1;
    yield 2;
  }

  @action("named")
  generatorMethod2 = function* () {
    yield 1;
    yield 2;
  }
}
