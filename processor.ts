let count = 0;
let parallelCount = 0;

export const processor = async (i: number) => {
    count++;
    parallelCount = Math.max(parallelCount, count);

    await new Promise(resolve => setTimeout(resolve, 10));
    
    count--;
    return i + 1;
};
