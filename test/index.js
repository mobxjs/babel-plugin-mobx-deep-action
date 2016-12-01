import path from 'path';
import fs from 'fs';
import assert from 'assert';
import { transformFromAst } from 'babel-core';
import * as babylon from 'babylon';
import plugin from '../src';

function trim(str) {
  return str.replace(/^\s+|\s+$/, '');
}

describe('Allow to reduce boilerplate of writing async actions', () => {
  const fixturesDir = path.join(__dirname, 'fixtures');
  fs.readdirSync(fixturesDir).map((caseName) => {
    it(`should ${caseName.split('-').join(' ')}`, () => {
      const fixtureDir = path.join(fixturesDir, caseName);
      const actualPath = path.join(fixtureDir, 'actual.js');
      const actual = transformFromAst(
        babylon.parse(
          fs.readFileSync(actualPath).toString(),
          {
            sourceType: "module",
            plugins: "*"
          }
        )
      ).code;

      const expected = fs.readFileSync(
          path.join(fixtureDir, 'expected.js')
      ).toString();

      assert.equal(trim(actual), trim(expected));
    });
  });
});
