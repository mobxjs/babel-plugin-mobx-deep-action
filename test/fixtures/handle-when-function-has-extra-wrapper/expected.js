import { action } from "mobx";

action(other(deep(wrapper(action(function () {
  let a = action(function () {
    let b = action(function () {
      let c = action(function () {});
    });
  });
})))));
