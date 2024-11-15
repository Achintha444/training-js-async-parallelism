// worker.ts
import { parentPort, workerData } from 'worker_threads';
import { processor } from './processor';

async function workerFiber<I, O>(queue: number[]): Promise<Array<PromiseSettledResult<number>>> {
    const results: Array<PromiseSettledResult<number>> = new Array(queue.length);
    let currentIndex = 0;

    const processSingle = async (): Promise<void> => {
        while (currentIndex < queue.length) {
            const index = currentIndex++;
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
    };

    await Promise.all(
        Array.from({ length: queue.length }, () => processSingle())
    );

    console.log(results.length);

    return results;
}

if (parentPort) {
    const { queue } = workerData;

    workerFiber(queue)
        .then(results => {
            parentPort!.postMessage(results);
        })
        .catch(error => {
            parentPort!.postMessage({
                error: error.message
            });
        });
}
