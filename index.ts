export const parallelize = async <I, O = I>(processor: (input: I) => Promise<O>, queue: I[], parallel?: number): Promise<PromiseSettledResult<O>[]> => {
  if (parallel === undefined) {
    return Promise.allSettled(queue.map(input => processor(input)));
  }
  const results: PromiseSettledResult<O>[] = [];
  results.length = queue.length;
  let index = 0;
  const fiber = async () => {
    while (index < queue.length) {
      const current = index++;
      try {
        results[current] = {
          status: 'fulfilled',
          value: await processor(queue[current])
        };
      } catch (reason) {
        results[current] = {
          status: 'rejected',
          reason
        };
      }
    }
  }
  await Promise.all(new Array(parallel).fill(0).map(fiber));
  return results;
};
