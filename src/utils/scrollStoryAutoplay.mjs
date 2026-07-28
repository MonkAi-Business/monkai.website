export const AUTO_SCROLL_CHAPTER_MS = 8000;

const clamp = (value, minimum, maximum) =>
  Math.min(Math.max(value, minimum), maximum);

const autoplayScrollKeys = new Set([
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'ArrowUp',
  'End',
  'Home',
  'PageDown',
  'PageUp',
  ' ',
]);

export function autoplayButtonState(playing) {
  return {
    ariaLabel: playing ? 'Monkey-tour pauzeren' : 'Monkey-tour afspelen',
    ariaPressed: String(playing),
    playing: String(playing),
  };
}

export function isAutoplayScrollKey(key) {
  return autoplayScrollKeys.has(key);
}

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
