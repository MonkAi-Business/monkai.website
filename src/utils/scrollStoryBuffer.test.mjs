import assert from 'node:assert/strict';
import test from 'node:test';
import { bufferedEnd, bufferStatus } from './scrollStoryBuffer.mjs';

test('bufferedEnd returns the furthest buffered point', () => {
  const ranges = {
    length: 3,
    end: (index) => [4, 11, 9][index],
  };

  assert.equal(bufferedEnd(ranges), 11);
});

test('bufferedEnd handles an empty buffer', () => {
  assert.equal(bufferedEnd({ length: 0, end: () => 0 }), 0);
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
