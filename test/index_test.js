import retry from '../src';
import assert from 'assert';

suite('retry', function() {

  test('success on third retry', async function() {
    let currentRetry;
    await retry(async (nth) => {
      currentRetry = nth;
      if (currentRetry === 3) return;
      throw new Error('retry...');
    });
    assert.equal(currentRetry, 3)
  });

  test('exponential backoff failure', async function() {
    this.timeout('1min');
    let start = Date.now();
    let opts = {
      retries: 3,
      interval: 100
    };

    try {
      await retry(opts, async () => {
        throw new Error('fail!');
      });
    } catch (e) {
      let duration = Date.now() - start;
      // 560 is chosen to allow for some drift...
      assert.ok(duration > 560);
      assert.ok(e.message.indexOf('after 3') !== -1);
      return;
    }
    throw new Error('Failed to throw error...');
  });

});
