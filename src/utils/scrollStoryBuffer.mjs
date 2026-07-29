export const bufferedEnd = (ranges) => {
  let furthest = 0;

  for (let index = 0; index < ranges.length; index += 1) {
    furthest = Math.max(furthest, ranges.end(index));
  }

  return furthest;
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
