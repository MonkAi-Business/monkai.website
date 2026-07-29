import assert from 'node:assert/strict';
import test from 'node:test';
import { initialBufferedEnd, bufferStatus } from './scrollStoryBuffer.mjs';

test('initialBufferedEnd returns the end of the range that starts at zero', () => {
  const ranges = {
    length: 3,
    start: (index) => [0, 64, 119.375][index],
    end: (index) => [4, 71, 119.5][index],
  };

  assert.equal(initialBufferedEnd(ranges), 4);
});

test('initialBufferedEnd ignores a distant range left by a previous seek', () => {
  const ranges = {
    length: 2,
    start: (index) => [0, 119.375][index],
    end: (index) => [0.083333, 119.5][index],
  };

  assert.equal(initialBufferedEnd(ranges), 0.083333);
});

test('initialBufferedEnd handles an empty buffer', () => {
  assert.equal(initialBufferedEnd({
    length: 0,
    start: () => 0,
    end: () => 0,
  }), 0);
});

test('bufferStatus reports real full-video progress', () => {
  assert.deepEqual(
    bufferStatus({
      duration: 120,
      bufferedUntil: 8,
      readyState: 3,
      requiredSeconds: 8,
    }),
    { progress: 7, ready: true },
  );
});

test('bufferStatus stays locked without future video data', () => {
  assert.deepEqual(
    bufferStatus({
      duration: 120,
      bufferedUntil: 20,
      readyState: 2,
      requiredSeconds: 8,
    }),
    { progress: 17, ready: false },
  );
});

test('bufferStatus clamps invalid and overflowing progress', () => {
  assert.deepEqual(
    bufferStatus({
      duration: Number.NaN,
      bufferedUntil: 20,
      readyState: 4,
    }),
    { progress: 0, ready: true },
  );
  assert.deepEqual(
    bufferStatus({
      duration: 10,
      bufferedUntil: 15,
      readyState: 4,
    }),
    { progress: 100, ready: true },
  );
});
