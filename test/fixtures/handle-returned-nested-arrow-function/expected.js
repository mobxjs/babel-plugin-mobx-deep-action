import { action } from 'mobx';

const nestedArrowWithoutBody = action(() => {
  return action(arg1 => action(arg2 => {}));
});

const nestedArrowWithBody = action(() => {
  return action(arg1 => {
    return action(arg2 => {});
  });
});
