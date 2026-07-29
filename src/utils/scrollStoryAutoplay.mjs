export const AUTO_SCROLL_CHAPTER_MS = 7500;

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

export function autoplayPlaybackRate(videoDuration, chapterCount) {
  const tourDurationSeconds = chapterCount * AUTO_SCROLL_CHAPTER_MS / 1000;
  if (
    !Number.isFinite(videoDuration)
    || videoDuration <= 0
    || !Number.isFinite(tourDurationSeconds)
    || tourDurationSeconds <= 0
  ) {
    return 1;
  }

  return clamp(videoDuration / tourDurationSeconds, 0.25, 4);
}

export function isAutoplayScrollKey(key) {
  return autoplayScrollKeys.has(key);
}

export function resolveAutoScrollStart(current, start, end) {
  if (current >= end - 1) return start;
  return clamp(current, start, end);
}
