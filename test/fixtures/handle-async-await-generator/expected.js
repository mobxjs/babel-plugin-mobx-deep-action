var _this = this;

import { action } from "mobx";

function a1() {}

action( /*#__PURE__*/regeneratorRuntime.mark(action(function doSome() {
  return regeneratorRuntime.wrap(action(function doSome$(_context) {
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
  }), doSome, this);
})));

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

class SomeClass {
  @action
  method() {
    return regeneratorRuntime.async(action(function _callee3$(_context5) {
      while (1) switch (_context5.prev = _context5.next) {
        case 0:
          _context5.next = 2;
          return regeneratorRuntime.awrap(1);

        case 2:
          _context5.next = 4;
          return regeneratorRuntime.awrap(2);

        case 4:
        case "end":
          return _context5.stop();
      }
    }), null, this);
  }

  @action("named")
  method1() {
    return regeneratorRuntime.async(action(function _callee4$(_context6) {
      while (1) switch (_context6.prev = _context6.next) {
        case 0:
          _context6.next = 2;
          return regeneratorRuntime.awrap(1);

        case 2:
          _context6.next = 4;
          return regeneratorRuntime.awrap(2);

        case 4:
        case "end":
          return _context6.stop();
      }
    }), null, this);
  }

  @action
  generatorMethod = /*#__PURE__*/regeneratorRuntime.mark(action(function _callee5() {
    return regeneratorRuntime.wrap(action(function _callee5$(_context7) {
      while (1) switch (_context7.prev = _context7.next) {
        case 0:
          _context7.next = 2;
          return 1;

        case 2:
          _context7.next = 4;
          return 2;

        case 4:
        case "end":
          return _context7.stop();
      }
    }), _callee5, this);
  }));

  @action("named")
  generatorMethod2 = /*#__PURE__*/regeneratorRuntime.mark(action(function _callee6() {
    return regeneratorRuntime.wrap(action(function _callee6$(_context8) {
      while (1) switch (_context8.prev = _context8.next) {
        case 0:
          _context8.next = 2;
          return 1;

        case 2:
          _context8.next = 4;
          return 2;

        case 4:
        case "end":
          return _context8.stop();
      }
    }), _callee6, this);
  }));
}
