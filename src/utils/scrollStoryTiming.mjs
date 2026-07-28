export function progressToTime(progress, chapterTimings) {
  const chapterPosition = Math.min(
    Math.max(progress, 0) * chapterTimings.length,
    chapterTimings.length - Number.EPSILON,
  );
  const chapterIndex = Math.min(
    Math.floor(chapterPosition),
    chapterTimings.length - 1,
  );
  const local = chapterPosition - chapterIndex;
  const move = local < 0.85 ? local / 0.85 : 1;
  const chapter = chapterTimings[chapterIndex];
  return chapter.timeStart + (chapter.timeEnd - chapter.timeStart) * move;
}
