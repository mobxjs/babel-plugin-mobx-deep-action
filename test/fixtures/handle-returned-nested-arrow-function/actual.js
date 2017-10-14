import { action } from 'mobx';

const nestedArrowWithoutBody = action(() => {
  return arg1 => arg2 => {};
});

const nestedArrowWithBody = action(() => {
  return arg1 => {
    return arg2 => {};
  };
});
