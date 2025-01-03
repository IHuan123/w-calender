import { expect, test } from 'vitest';
import { isTimeBetween } from '../src/utils/time';

test('test isTimeBetween utils', () => {
  let res = isTimeBetween('2024-12-12', ['2024-12-11', '2024-12-13']);
  expect(res).toBe(true);
});
