import { it, expect } from 'vitest'
import { parallelize } from '.'

it('exports a function', () => {
  expect(typeof parallelize).toStrictEqual('function')
})

it('accepts at least two parameters', () => {
  expect(parallelize.length).toBeGreaterThanOrEqual(1)
})

const getFulfilledValues = <T>(results: Array<PromiseSettledResult<T>>): Array<T | undefined> => {
  return results.map(result => result.status === 'fulfilled' ? result.value : undefined)
}

for (let parallel = 1; parallel <= 14; ++parallel) {
  it(`executes in batch size : ${parallel}`, async () => {
    const INPUT_SIZE = 5000;

    let start = Date.now();
    const results = await parallelize(new Array(INPUT_SIZE).fill(0).map((_, index) => index), parallel, 4);
    const end = Date.now();

    console.log(`parallel: ${parallel}, time: ${end - start}ms`);

    expect(getFulfilledValues(results).every((value, index) => value === index + 1)).toStrictEqual(true);
    expect(results.length).toStrictEqual(INPUT_SIZE)
  }, 100000)
}
