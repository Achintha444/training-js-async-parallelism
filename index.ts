export const parallelize = async <I, O = I>(processor: (input: I) => Promise<O>, queue: I[], parallel?: number): Promise<PromiseSettledResult<O>[]> => {
  if (parallel === undefined) {
    return Promise.allSettled(queue.map(input => processor(input)));
  }
  const results: PromiseSettledResult<O>[] = [];
  results.length = queue.length;
  for (let index = 0; index < queue.length; ++index) {
    try {
      results[index] = {
        status: 'fulfilled',
        value: await processor(queue[index])
      };
    } catch (reason) {
      results[index] = {
        status: 'rejected',
        reason
      };
    }
  }
  return results;
};
