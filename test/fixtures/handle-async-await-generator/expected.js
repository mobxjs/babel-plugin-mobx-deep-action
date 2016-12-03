var _this = this;

import { action } from "mobx";

function a1() {}

action(regeneratorRuntime.mark(function doSome() {
  return regeneratorRuntime.wrap(function doSome$(_context) {
    while (1) switch (_context.prev = _context.next) {
      case 0:
        _context.next = 2;
        return 1;

      case 2:
        _context.next = 4;
        return 2;

      case 4:
      case "end":
        return _context.stop();
    }
  }, doSome, this);
}));

action(function doSomeSpecial() {
  return regeneratorRuntime.async(action(function doSomeSpecial$(_context2) {
    while (1) switch (_context2.prev = _context2.next) {
      case 0:
        _context2.next = 2;
        return regeneratorRuntime.awrap(1);

      case 2:
        _context2.next = 4;
        return regeneratorRuntime.awrap(2);

      case 4:
      case "end":
        return _context2.stop();
    }
  }), null, this);
});

action(() => {
  return regeneratorRuntime.async(action(function _callee$(_context3) {
    while (1) switch (_context3.prev = _context3.next) {
      case 0:
        _context3.next = 2;
        return regeneratorRuntime.awrap(1);

      case 2:
        _context3.next = 4;
        return regeneratorRuntime.awrap(2);

      case 4:
      case "end":
        return _context3.stop();
    }
  }), null, _this);
});

action(() => {
  var a;
  return regeneratorRuntime.async(action(function _callee2$(_context4) {
    while (1) switch (_context4.prev = _context4.next) {
      case 0:
        _context4.next = 2;
        return regeneratorRuntime.awrap(1);

      case 2:
        _context4.t0 = _context4.sent;
        _context4.next = 5;
        return regeneratorRuntime.awrap(2);

      case 5:
        _context4.t1 = _context4.sent;
        a = [_context4.t0, _context4.t1];

      case 7:
      case "end":
        return _context4.stop();
    }
  }), null, _this);
});