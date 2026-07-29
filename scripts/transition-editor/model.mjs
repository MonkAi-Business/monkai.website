import { isAbsolute, relative, resolve } from 'node:path';

function finiteNumber(value, name) {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    throw new TypeError(`${name} must be a finite number.`);
  }
  return value;
}

function nonNegativeNumber(value, name) {
  const number = finiteNumber(value, name);
  if (number < 0) {
    throw new RangeError(`${name} must be non-negative.`);
  }
  return number;
}

export function effectiveTrim(scene) {
  const duration = nonNegativeNumber(scene?.duration, 'duration');
  if (duration === 0) {
    throw new RangeError('Scene duration must be greater than zero.');
  }

  const trimStart = scene.trimStart === undefined
    ? 0
    : nonNegativeNumber(scene.trimStart, 'trimStart');
  const trimEnd = scene.trimEnd === undefined
    ? duration
    : nonNegativeNumber(scene.trimEnd, 'trimEnd');

  if (trimEnd > duration) {
    throw new RangeError('trimEnd must not exceed the scene duration.');
  }
  if (trimStart >= trimEnd) {
    throw new RangeError('trimStart must be before trimEnd.');
  }

  return {
    trimStart,
    trimEnd,
    playDuration: Number((trimEnd - trimStart).toFixed(6)),
  };
}

export function updateBoundary(scenes, boundaryIndex, values) {
  if (
    !Array.isArray(scenes)
    || !Number.isInteger(boundaryIndex)
    || boundaryIndex < 1
    || boundaryIndex >= scenes.length
  ) {
    throw new RangeError('Boundary index must identify two existing scenes.');
  }

  const updated = scenes.map((scene) => ({ ...scene }));
  const left = updated[boundaryIndex - 1];
  const right = updated[boundaryIndex];

  if (values?.reset === true) {
    delete left.trimEnd;
    delete right.trimStart;
    effectiveTrim(left);
    effectiveTrim(right);
    return updated;
  }

  left.trimEnd = finiteNumber(values?.leftTrimEnd, 'leftTrimEnd');
  right.trimStart = finiteNumber(values?.rightTrimStart, 'rightTrimStart');
  effectiveTrim(left);
  effectiveTrim(right);
  return updated;
}

export function resolveSceneMedia(scenes, sceneId, sourceDirectory) {
  const scene = scenes.find((candidate) => candidate.id === sceneId);
  if (!scene) {
    throw new RangeError(`Unknown scene: ${sceneId}`);
  }
  if (typeof scene.file !== 'string' || scene.file.length === 0) {
    throw new TypeError(`Scene ${sceneId} has no source file.`);
  }

  const sourceRoot = resolve(sourceDirectory);
  const mediaPath = resolve(sourceRoot, scene.file);
  const relativePath = relative(sourceRoot, mediaPath);
  if (
    relativePath === ''
    || relativePath.startsWith('..')
    || isAbsolute(relativePath)
  ) {
    if (relativePath === '') {
      throw new RangeError(`Scene ${sceneId} must resolve to a file below the source directory.`);
    }
    throw new RangeError(`Scene ${sceneId} resolves outside the source directory.`);
  }

  return mediaPath;
}
