import * as tslib_1 from "tslib";
import { action } from "mobx";
export default class Class2 {
    method() {
        return tslib_1.__awaiter(this, void 0, void 0, action(function* () {
            const a = action(other => {});
            return a(action(function () {}));
        }));
    }
}
tslib_1.__decorate([action, tslib_1.__metadata("design:type", Function), tslib_1.__metadata("design:paramtypes", []), tslib_1.__metadata("design:returntype", Promise)], Class2.prototype, "method", null);
