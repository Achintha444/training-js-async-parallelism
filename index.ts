export const parallelize = async <I, O = I>(processor: (input: I) => Promise<O>, queue: I[]): Promise<PromiseSettledResult<O>[]> => {
  return Promise.allSettled(queue.map(input => processor(input)));
};
