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

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

it('executes everything in parallel', async () => {
  const INPUT_SIZE = 100;
  let parallelCount = 0;
  let count = 0;
  const results = await parallelize(async (i: number) => {
    ++count;
    parallelCount = Math.max(parallelCount, count);
    await sleep(10);
    --count;
    return i + 1;
  }, new Array(INPUT_SIZE).fill(0));
  expect(getFulfilledValues(results).every(value => value === 1)).toStrictEqual(true);
  expect(parallelCount).toStrictEqual(INPUT_SIZE);
});

it('executes one by one', async () => {
  const INPUT_SIZE = 100;
  let parallelCount = 0;
  let count = 0;
  const results = await parallelize(async (i: number) => {
    ++count;
    parallelCount = Math.max(parallelCount, count);
    await sleep(10);
    --count;
    return i + 1;
  }, new Array(INPUT_SIZE).fill(0).map((_, index) => index), 1);
  expect(getFulfilledValues(results).every((value, index) => value === index + 1)).toStrictEqual(true);
  expect(parallelCount).toStrictEqual(1);
});

for(let parallel = 2; parallel <= 10; ++parallel) {
  it(`executes in batch size : ${parallel}`, async () => {
    const INPUT_SIZE = 100;
    let parallelCount = 0;
    let count = 0;
    const results = await parallelize(async (i: number) => {
      ++count;
      parallelCount = Math.max(parallelCount, count);
      await sleep(10);
      --count;
      return i + 1;
    }, new Array(INPUT_SIZE).fill(0).map((_, index) => index), parallel);
    expect(getFulfilledValues(results).every((value, index) => value === index + 1)).toStrictEqual(true);
    expect(parallelCount).toStrictEqual(parallel);
  });
}