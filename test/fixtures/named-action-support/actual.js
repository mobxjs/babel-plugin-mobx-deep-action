import {action} from "mobx"
import * as tslib_1 from "tslib";
import * as mobx from "mobx";

const namedAction1 = action("name", function namedAction() {
  return function() {
  }
})

class SomeClass1 {
  @action("name")
  method1() {
    return function() {

    }
  }

  @action("name")
  method2 = () => {
    return () => {}
  }
}

class Class1 {
  constructor() {
    this.method1 = async () => {
      const a = (other) => { };
      return a(function () { });
    };
    this.method2 = () => {
      return function() {}
    }
  }
  method() {
    const a = (other) => { };
    return a(function () { });
  }
  method2() {
    class Class2 {
      async method() {
        const a = (other) => { };
        return a(function () { });
      }
    }
    tslib_1.__decorate([
      action("name")
    ], Class2.prototype, "method", null);
    return Class2;
  }
}
tslib_1.__decorate([
  mobx.action("name")
], Class1.prototype, "method", null);
tslib_1.__decorate([
  action
], Class1.prototype, "method1", void 0);
export class Class2 {
  async method() {
    const a = (other) => { };
    return a(function () { });
  }
}
tslib_1.__decorate([
  action("name")
], Class2.prototype, "method", null);

export default class Class3 {
  method() {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
      const a = (other) => { };
      return a(function () { });
    });
  }
}
tslib_1.__decorate([
  action("name"),
  tslib_1.__metadata("design:type", Function),
  tslib_1.__metadata("design:paramtypes", []),
  tslib_1.__metadata("design:returntype", Promise)
], Class3.prototype, "method", null);
