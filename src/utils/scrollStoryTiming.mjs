// Elk hoofdstuk krijgt een scrollaandeel dat evenredig is met zijn eigen gewicht.
// Zonder gewicht valt een hoofdstuk terug op 1, en dan zijn alle stukken weer gelijk.
function chapterWeights(chapterTimings) {
  return chapterTimings.map((chapter) => (
    Number.isFinite(chapter.weight) && chapter.weight > 0 ? chapter.weight : 1
  ));
}

export function progressToTime(progress, chapterTimings) {
  if (chapterTimings.length === 0) return 0;

  const weights = chapterWeights(chapterTimings);
  const total = weights.reduce((sum, weight) => sum + weight, 0);
  let remaining = Math.min(Math.max(progress, 0), 1) * total;

  for (let index = 0; index < chapterTimings.length; index += 1) {
    const last = index === chapterTimings.length - 1;
    if (remaining < weights[index] || last) {
      const chapter = chapterTimings[index];
      const local = Math.min(remaining / weights[index], 1);
      return chapter.timeStart + (chapter.timeEnd - chapter.timeStart) * local;
    }
    remaining -= weights[index];
  }

  return chapterTimings[chapterTimings.length - 1].timeEnd;
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

  const weights = chapterWeights(chapterTimings);
  const total = weights.reduce((sum, weight) => sum + weight, 0);
  const before = weights
    .slice(0, safeIndex)
    .reduce((sum, weight) => sum + weight, 0);

  return Math.min(
    Math.max((before + local * weights[safeIndex]) / total, 0),
    1,
  );
}
