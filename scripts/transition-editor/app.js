import { frameStepSeconds, previewRanges } from './preview.mjs';

const select = document.querySelector('[data-boundary-select]');
const leftVideo = document.querySelector('[data-left-video]');
const rightVideo = document.querySelector('[data-right-video]');
const previewLeft = document.querySelector('[data-preview-left]');
const previewRight = document.querySelector('[data-preview-right]');
const previewToggle = document.querySelector('[data-preview-toggle]');
const previewLoop = document.querySelector('[data-preview-loop]');
const status = document.querySelector('[data-status]');
const saveButton = document.querySelector('[data-save]');
const resetButton = document.querySelector('[data-reset]');

let scenes = [];
let boundaries = [];
let selectedBoundary = null;
let leftCut = 0;
let rightCut = 0;
let previewPlaying = false;
let previewPhase = 'left';
let previewWindow = null;

const sceneById = (id) => scenes.find((scene) => scene.id === id);
const formatTime = (value) => `${Number(value).toFixed(3)} s`;

function report(message, kind = '') {
  status.textContent = message;
  status.dataset.kind = kind;
}

function setBusy(busy) {
  saveButton.disabled = busy;
  resetButton.disabled = busy;
  select.disabled = busy;
}

function updateCutLabels() {
  document.querySelector('[data-left-cut]').textContent = formatTime(leftCut);
  document.querySelector('[data-right-cut]').textContent = formatTime(rightCut);
  document.querySelector('[data-preview-label]').textContent =
    `${formatTime(leftCut)} → ${formatTime(rightCut)}`;
}

function setVideoSource(video, scene) {
  video.pause();
  video.src = scene.mediaUrl;
  video.load();
}

function stopPreview() {
  previewPlaying = false;
  previewLeft.pause();
  previewRight.pause();
  previewToggle.textContent = '▶ Preview afspelen';
}

function showPreviewPhase(phase) {
  previewPhase = phase;
  const showingLeft = phase === 'left';
  previewLeft.hidden = !showingLeft;
  previewRight.hidden = showingLeft;
  document.querySelector('[data-preview-phase]').textContent =
    showingLeft ? 'Clip 1' : 'Clip 2';
}

async function beginLeftPreview() {
  const left = sceneById(selectedBoundary.leftId);
  const right = sceneById(selectedBoundary.rightId);
  previewWindow = previewRanges(
    { ...left.effectiveTrim, trimEnd: leftCut },
    { ...right.effectiveTrim, trimStart: rightCut },
  );

  showPreviewPhase('left');
  previewLeft.currentTime = previewWindow.left.start;
  previewRight.currentTime = previewWindow.right.start;
  previewPlaying = true;
  previewToggle.textContent = '■ Preview stoppen';
  await previewLeft.play();
}

async function beginRightPreview() {
  previewLeft.pause();
  showPreviewPhase('right');
  previewRight.currentTime = previewWindow.right.start;
  await previewRight.play();
}

async function finishPreview() {
  previewRight.pause();
  if (previewLoop.checked) {
    await beginLeftPreview();
  } else {
    stopPreview();
  }
}

function selectBoundary(boundaryIndex) {
  stopPreview();
  selectedBoundary = boundaries.find(
    (boundary) => boundary.index === Number(boundaryIndex),
  );
  if (!selectedBoundary) return;

  const left = sceneById(selectedBoundary.leftId);
  const right = sceneById(selectedBoundary.rightId);
  leftCut = left.effectiveTrim.trimEnd;
  rightCut = right.effectiveTrim.trimStart;

  document.querySelector('[data-left-name]').textContent = left.id;
  document.querySelector('[data-right-name]').textContent = right.id;
  setVideoSource(leftVideo, left);
  setVideoSource(rightVideo, right);
  setVideoSource(previewLeft, left);
  setVideoSource(previewRight, right);
  showPreviewPhase('left');
  updateCutLabels();
  report(`Overgang ${left.id} → ${right.id} geladen.`);
}

function stepVideo(video, direction) {
  const duration = Number.isFinite(video.duration) ? video.duration : Infinity;
  video.currentTime = Math.min(
    Math.max(video.currentTime + direction * frameStepSeconds, 0),
    duration,
  );
}

async function saveBoundary(values) {
  setBusy(true);
  stopPreview();
  try {
    const response = await fetch(`/api/boundaries/${selectedBoundary.index}`, {
      method: 'PUT',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(values),
    });
    const payload = await response.json();
    if (!response.ok) throw new Error(payload.error ?? 'Opslaan is mislukt.');
    scenes = payload.scenes;
    selectBoundary(selectedBoundary.index);
    report('Knippunten opgeslagen in monkey-scenes.json.', 'success');
  } catch (error) {
    report(error.message, 'error');
  } finally {
    setBusy(false);
  }
}

async function loadEditor() {
  try {
    const response = await fetch('/api/scenes');
    const payload = await response.json();
    if (!response.ok) throw new Error(payload.error ?? 'Scènes laden is mislukt.');
    scenes = payload.scenes;
    boundaries = payload.boundaries;
    select.replaceChildren(...boundaries.map((boundary) => {
      const option = document.createElement('option');
      option.value = boundary.index;
      option.textContent = `${boundary.leftId} → ${boundary.rightId}`;
      return option;
    }));
    selectBoundary(boundaries[0].index);
  } catch (error) {
    report(error.message, 'error');
  }
}

select.addEventListener('change', () => selectBoundary(select.value));
document.querySelector('[data-left-back]')
  .addEventListener('click', () => stepVideo(leftVideo, -1));
document.querySelector('[data-left-forward]')
  .addEventListener('click', () => stepVideo(leftVideo, 1));
document.querySelector('[data-right-back]')
  .addEventListener('click', () => stepVideo(rightVideo, -1));
document.querySelector('[data-right-forward]')
  .addEventListener('click', () => stepVideo(rightVideo, 1));
document.querySelector('[data-capture-left]').addEventListener('click', () => {
  leftCut = leftVideo.currentTime;
  updateCutLabels();
  report('Nieuw eindpunt voor clip 1 klaar om op te slaan.');
});
document.querySelector('[data-capture-right]').addEventListener('click', () => {
  rightCut = rightVideo.currentTime;
  updateCutLabels();
  report('Nieuw startpunt voor clip 2 klaar om op te slaan.');
});

previewToggle.addEventListener('click', async () => {
  if (previewPlaying) {
    stopPreview();
    return;
  }
  try {
    await beginLeftPreview();
  } catch {
    stopPreview();
    report('De preview kon niet worden afgespeeld.', 'error');
  }
});

previewLeft.addEventListener('timeupdate', () => {
  if (
    previewPlaying
    && previewPhase === 'left'
    && previewLeft.currentTime >= previewWindow.left.end - 0.012
  ) {
    beginRightPreview().catch(() => {
      stopPreview();
      report('De tweede clip kon niet worden afgespeeld.', 'error');
    });
  }
});

previewRight.addEventListener('timeupdate', () => {
  if (
    previewPlaying
    && previewPhase === 'right'
    && previewRight.currentTime >= previewWindow.right.end - 0.012
  ) {
    finishPreview().catch(() => {
      stopPreview();
      report('De preview kon niet opnieuw beginnen.', 'error');
    });
  }
});

saveButton.addEventListener('click', () => saveBoundary({
  leftTrimEnd: leftCut,
  rightTrimStart: rightCut,
}));
resetButton.addEventListener('click', () => saveBoundary({ reset: true }));

leftVideo.addEventListener('error', () => report('Clip 1 kon niet worden geladen.', 'error'));
rightVideo.addEventListener('error', () => report('Clip 2 kon niet worden geladen.', 'error'));

loadEditor();
