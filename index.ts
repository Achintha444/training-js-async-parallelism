import path from 'path';
import { Worker } from 'worker_threads';
import { processor } from './processor';

/**
 * General function to parallel execute a function on an array of items. Using
 * worker threads and parallel executions in the main thread.
 * 
 * @param queue Array of items to process (You can use your array items)
 * @param parallel How many parallel executions to run in the main thread.
 * @param workerCount Number of worker threads to be spawned.
 * @returns Result of the processing of the queue.
 */
export const parallelize = async <I>(
  queue: number[],
  parallel: number = 1,
  workerCount?: number
): Promise<Array<PromiseSettledResult<number>>> => {

  /**
   * If no worker count is provided or is 0, we run everything in the main thread.
   * Using parallel executions if parallel is provided.
   */
  if (workerCount === undefined || workerCount === 0) {
    if (parallel === undefined) {
      return await Promise.allSettled(queue.map(async input => await processor(input)))
    }

    const results: Array<PromiseSettledResult<number>> = [];
    results.length = queue.length;
    let index = 0;

    const fiber = async (): Promise<void> => {
      while (index < queue.length) {
        const current = index++
        try {
          results[current] = {
            status: 'fulfilled',
            value: await processor(queue[current])
          }
        } catch (reason) {
          results[current] = {
            status: 'rejected',
            reason
          }
        }
      }
    }
    await Promise.all(new Array(parallel).fill(0).map(fiber));
    return results;
  } else {

    /**
     * If worker count is provided, we split the queue into chunks and run the
     * processor in parallel in the main thread and in the worker threads.
     * In the main thread we run the processor in parallel and in the worker
     * threads we run the processor in parallel.
     */
    const itemsPerWorker = Math.ceil(queue.length / (workerCount + 1));
    const mainThreadQueue = queue.slice(0, itemsPerWorker);
    const workerQueues = [];

    for (let i = 0; i < workerCount; i++) {
      const start = itemsPerWorker + (i * itemsPerWorker);
      const end = Math.min(start + itemsPerWorker, queue.length);
      workerQueues.push(queue.slice(start, end));
    }

    const mainThreadResults = new Array(mainThreadQueue.length);
    let mainIndex = 0;

    /**
     * Run the processors in the main thread.
     */
    const mainFiber = async (): Promise<void> => {
      while (mainIndex < mainThreadQueue.length) {
        const current = mainIndex++;
        try {
          mainThreadResults[current] = {
            status: 'fulfilled',
            value: await processor(mainThreadQueue[current])
          };
        } catch (reason) {
          mainThreadResults[current] = {
            status: 'rejected',
            reason
          };
        }
      }
    };

    /**
     * Run the processors in the provided number of worker threads.
     */
    const workerPromises = workerQueues.map((workerQueue, index) => {
      return new Promise<Array<PromiseSettledResult<number>>>((resolve, reject) => {
        const workerPath = path.resolve(__dirname, './dist/worker.js');
        const worker = new Worker(workerPath, {
          workerData: {
            queue: workerQueue
          }
        });

        worker.on('message', (result) => {
          resolve(result);
          worker.terminate();
        });

        worker.on('error', reject);
        worker.on('exit', (code) => {
          if (code !== 0) {
            reject(new Error(`Worker stopped with exit code ${code}`));
          }
        });
      });
    });

    const mainThreadPromise = Promise.all(
      new Array(Math.min(parallel, mainThreadQueue.length))
        .fill(0)
        .map(mainFiber)
    );

    try {
      const [_, ...workerResults] = await Promise.all([
        mainThreadPromise,
        ...workerPromises
      ]);

      return [
        ...mainThreadResults,
        ...workerResults.flat()
      ];

    } catch (error: any) {
      throw new Error(`Worker thread error: ${error.message}`);
    }
  }
}
