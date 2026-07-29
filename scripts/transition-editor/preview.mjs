export const frameStepSeconds = 1 / 24;

export function previewRanges(leftTrim, rightTrim) {
  return {
    left: {
      start: Math.max(leftTrim.trimStart, leftTrim.trimEnd - 2),
      end: leftTrim.trimEnd,
    },
    right: {
      start: rightTrim.trimStart,
      end: Math.min(rightTrim.trimEnd, rightTrim.trimStart + 2),
    },
  };
}
