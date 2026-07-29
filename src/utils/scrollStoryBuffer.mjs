export const initialBufferedEnd = (ranges) => {
  let contiguousEnd = 0;

  for (let index = 0; index < ranges.length; index += 1) {
    const start = ranges.start(index);
    if (start > contiguousEnd + 0.05) break;
    contiguousEnd = Math.max(contiguousEnd, ranges.end(index));
  }

  return contiguousEnd;
};

export const bufferStatus = ({
  duration,
  bufferedUntil,
  readyState,
  requiredSeconds = 8,
}) => ({
  progress: Number.isFinite(duration) && duration > 0
    ? Math.round(Math.min(1, Math.max(0, bufferedUntil / duration)) * 100)
    : 0,
  ready: bufferedUntil >= requiredSeconds && readyState >= 3,
});
