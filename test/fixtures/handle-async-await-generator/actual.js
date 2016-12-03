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
