import assert from 'assert';

const DEFAULT_RETRIES = 10;
const DEFAULT_INTERVAL = 500;

export default async function (options, func) {
  if (typeof options === 'function') {
    func = options;
    options = {};
  }

  let start = Date.now();
  let { retries, interval } = options;
  retries = retries || DEFAULT_RETRIES;
  interval = interval || DEFAULT_INTERVAL;

  let currentRetry = 0;
  while (currentRetry++ < retries) {
    try {
      return await func(currentRetry);
    } catch (e) {
      let sleep = currentRetry * interval;
      // wait for a bit before retrying...
      await new Promise((accept) => setTimeout(accept, sleep));
    }
  }

  throw new Error(`
    Failed to resolve promise after ${retries} over ${Date.now() - start} ms
  `);
}
