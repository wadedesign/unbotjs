const startTimes = new Map();

export const startLoading = (key) => {
    startTimes.set(key, Date.now());
};

export const finishLoading = (key) => {
    const startTime = startTimes.get(key);
    const endTime = Date.now();
    const timeTaken = endTime - startTime;
    console.log(`\x1b[32m✔\x1b[0m Loading command: \x1b[36m${key}\x1b[0m - \x1b[33m${timeTaken}ms\x1b[0m`);
    startTimes.delete(key); 
};
