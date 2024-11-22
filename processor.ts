let count = 0;
let parallelCount = 0;

/**
 * This function is used to mimic async work. But in your work this
 * function should be replaced with your actual async work.
 */
export const processor = async (i: number) => {
    count++;
    parallelCount = Math.max(parallelCount, count);

    await new Promise(resolve => setTimeout(resolve, 10));
    
    count--;
    return i + 1;
};
