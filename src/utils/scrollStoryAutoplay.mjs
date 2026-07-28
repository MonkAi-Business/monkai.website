export const AUTO_SCROLL_CHAPTER_MS = 8000;

const clamp = (value, minimum, maximum) =>
  Math.min(Math.max(value, minimum), maximum);

export function resolveAutoScrollStart(current, start, end) {
  if (current >= end - 1) return start;
  return clamp(current, start, end);
}

export function advanceAutoScroll({
  position,
  elapsedMs,
  start,
  end,
  chapterCount,
}) {
  const distance = Math.max(end - start, 0);
  const duration = Math.max(chapterCount, 0) * AUTO_SCROLL_CHAPTER_MS;

  if (distance === 0 || duration === 0) {
    return { position: start, done: true };
  }

  const speed = distance / duration;
  const nextPosition = clamp(
    position + speed * Math.max(elapsedMs, 0),
    start,
    end,
  );

  return {
    position: nextPosition,
    done: nextPosition >= end,
  };
}
