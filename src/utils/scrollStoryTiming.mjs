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
  const chapter = chapterTimings[chapterIndex];
  return chapter.timeStart + (chapter.timeEnd - chapter.timeStart) * local;
}

export function timeToProgress(time, chapterTimings) {
  if (chapterTimings.length === 0) return 0;

  const first = chapterTimings[0];
  const last = chapterTimings[chapterTimings.length - 1];
  if (time <= first.timeStart) return 0;
  if (time >= last.timeEnd) return 1;

  const chapterIndex = chapterTimings.findIndex(
    (chapter) => time <= chapter.timeEnd,
  );
  const safeIndex = chapterIndex === -1
    ? chapterTimings.length - 1
    : chapterIndex;
  const chapter = chapterTimings[safeIndex];
  const chapterDuration = chapter.timeEnd - chapter.timeStart;
  const local = chapterDuration > 0
    ? (time - chapter.timeStart) / chapterDuration
    : 0;

  return Math.min(
    Math.max((safeIndex + local) / chapterTimings.length, 0),
    1,
  );
}
