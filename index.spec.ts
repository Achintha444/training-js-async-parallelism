import { it, expect } from 'vitest';
import { parallelize } from '.';

it('exports a function', () => {
  expect(typeof parallelize).toStrictEqual('function');
});

it('accepts at least two parameters', () => {
  expect(parallelize.length).toBeGreaterThanOrEqual(2);
});

const getFulfilledValues = <T>(results: PromiseSettledResult<T>[]): (T | undefined)[] => {
  return results.map(result => result.status === 'fulfilled' ? result.value : undefined);
};

it('runs the processor on all items of the queue', async () => {
  const results = await parallelize(async (i: number) => i + 1, [0, 1, 2, 3, 4, 5]);
  expect(results.every(result => result.status === 'fulfilled'));
  expect(getFulfilledValues(results)).toStrictEqual([1, 2, 3, 4, 5, 6]);
});
