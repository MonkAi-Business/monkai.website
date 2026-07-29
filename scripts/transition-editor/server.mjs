import { createReadStream } from 'node:fs';
import {
  readFile,
  rename,
  stat,
  unlink,
  writeFile,
} from 'node:fs/promises';
import { createServer } from 'node:http';
import {
  dirname,
  extname,
  join,
  relative,
  resolve,
} from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  effectiveTrim,
  resolveSceneMedia,
  updateBoundary,
} from './model.mjs';

const moduleDirectory = dirname(fileURLToPath(import.meta.url));
const defaultManifestPath = resolve(moduleDirectory, '..', 'monkey-scenes.json');
const defaultSourceDirectory = 'C:\\Users\\stijn\\Downloads';
const maximumBodyBytes = 16 * 1024;

const contentTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
};

function sendJson(response, status, payload) {
  const body = `${JSON.stringify(payload)}\n`;
  response.writeHead(status, {
    'content-type': 'application/json; charset=utf-8',
    'content-length': Buffer.byteLength(body),
  });
  response.end(body);
}

async function readManifest(manifestPath) {
  const scenes = JSON.parse(await readFile(manifestPath, 'utf8'));
  if (!Array.isArray(scenes) || scenes.length < 2) {
    throw new TypeError('The scene manifest must contain at least two scenes.');
  }
  scenes.forEach((scene) => effectiveTrim(scene));
  return scenes;
}

async function readJsonBody(request) {
  let size = 0;
  const chunks = [];
  for await (const chunk of request) {
    size += chunk.length;
    if (size > maximumBodyBytes) {
      throw new RangeError('Request body is too large.');
    }
    chunks.push(chunk);
  }
  try {
    return JSON.parse(Buffer.concat(chunks).toString('utf8'));
  } catch {
    throw new TypeError('Request body must contain valid JSON.');
  }
}

async function saveManifestAtomically(manifestPath, scenes) {
  const temporaryPath = `${manifestPath}.${process.pid}.${Date.now()}.tmp`;
  const serialized = JSON.stringify(scenes, null, 2)
    .replace(/("duration": )(-?\d+)(,)/g, '$1$2.0$3')
    .replace(/("transition": )(-?\d+)([,\n])/g, '$1$2.0$3');
  try {
    await writeFile(temporaryPath, `${serialized}\n`, 'utf8');
    await rename(temporaryPath, manifestPath);
  } catch (error) {
    await unlink(temporaryPath).catch(() => {});
    throw error;
  }
}

function parseRange(rangeHeader, size) {
  if (!rangeHeader) return null;
  const match = /^bytes=(\d*)-(\d*)$/.exec(rangeHeader);
  if (!match) throw new RangeError('Unsupported byte range.');

  const start = match[1] === '' ? 0 : Number(match[1]);
  const end = match[2] === '' ? size - 1 : Number(match[2]);
  if (
    !Number.isInteger(start)
    || !Number.isInteger(end)
    || start < 0
    || end < start
    || start >= size
  ) {
    throw new RangeError('Invalid byte range.');
  }
  return { start, end: Math.min(end, size - 1) };
}

async function serveMedia(request, response, sceneId, options) {
  const scenes = await readManifest(options.manifestPath);
  let mediaPath;
  try {
    mediaPath = resolveSceneMedia(scenes, sceneId, options.sourceDirectory);
  } catch (error) {
    sendJson(response, 404, { error: error.message });
    return;
  }

  let details;
  try {
    details = await stat(mediaPath);
  } catch {
    sendJson(response, 404, { error: `Source clip is missing for scene ${sceneId}.` });
    return;
  }

  let range;
  try {
    range = parseRange(request.headers.range, details.size);
  } catch (error) {
    response.writeHead(416, { 'content-range': `bytes */${details.size}` });
    response.end(error.message);
    return;
  }

  const contentType = contentTypes[extname(mediaPath).toLowerCase()]
    ?? 'application/octet-stream';
  if (!range) {
    response.writeHead(200, {
      'accept-ranges': 'bytes',
      'content-length': details.size,
      'content-type': contentType,
    });
    createReadStream(mediaPath).pipe(response);
    return;
  }

  response.writeHead(206, {
    'accept-ranges': 'bytes',
    'content-length': range.end - range.start + 1,
    'content-range': `bytes ${range.start}-${range.end}/${details.size}`,
    'content-type': contentType,
  });
  createReadStream(mediaPath, range).pipe(response);
}

async function serveStatic(response, pathname, staticDirectory) {
  const requested = pathname === '/' ? 'index.html' : pathname.slice(1);
  const root = resolve(staticDirectory);
  const filePath = resolve(root, requested);
  const relativePath = relative(root, filePath);
  if (relativePath.startsWith('..')) {
    sendJson(response, 404, { error: 'Not found.' });
    return;
  }

  try {
    const contents = await readFile(filePath);
    response.writeHead(200, {
      'content-type': contentTypes[extname(filePath)] ?? 'application/octet-stream',
      'content-length': contents.length,
    });
    response.end(contents);
  } catch {
    sendJson(response, 404, { error: 'Not found.' });
  }
}

export function createTransitionEditorServer({
  manifestPath = defaultManifestPath,
  sourceDirectory = defaultSourceDirectory,
  staticDirectory = moduleDirectory,
} = {}) {
  const options = {
    manifestPath: resolve(manifestPath),
    sourceDirectory: resolve(sourceDirectory),
    staticDirectory: resolve(staticDirectory),
  };

  return createServer(async (request, response) => {
    try {
      const url = new URL(request.url, 'http://127.0.0.1');

      if (request.method === 'GET' && url.pathname === '/api/scenes') {
        const scenes = await readManifest(options.manifestPath);
        sendJson(response, 200, {
          scenes: scenes.map((scene) => ({
            ...scene,
            effectiveTrim: effectiveTrim(scene),
            mediaUrl: `/api/media/${encodeURIComponent(scene.id)}`,
          })),
          boundaries: scenes.slice(1).map((scene, index) => ({
            index: index + 1,
            leftId: scenes[index].id,
            rightId: scene.id,
          })),
        });
        return;
      }

      if (request.method === 'GET' && url.pathname.startsWith('/api/media/')) {
        const sceneId = decodeURIComponent(url.pathname.slice('/api/media/'.length));
        await serveMedia(request, response, sceneId, options);
        return;
      }

      const boundaryMatch = /^\/api\/boundaries\/(\d+)$/.exec(url.pathname);
      if (request.method === 'PUT' && boundaryMatch) {
        try {
          const values = await readJsonBody(request);
          const scenes = await readManifest(options.manifestPath);
          const updated = updateBoundary(scenes, Number(boundaryMatch[1]), values);
          await saveManifestAtomically(options.manifestPath, updated);
          sendJson(response, 200, {
            scenes: updated.map((scene) => ({
              ...scene,
              effectiveTrim: effectiveTrim(scene),
              mediaUrl: `/api/media/${encodeURIComponent(scene.id)}`,
            })),
          });
        } catch (error) {
          sendJson(response, 400, { error: error.message });
        }
        return;
      }

      if (request.method === 'GET') {
        await serveStatic(response, url.pathname, options.staticDirectory);
        return;
      }

      sendJson(response, 405, { error: 'Method not allowed.' });
    } catch {
      sendJson(response, 500, { error: 'The transition editor could not handle this request.' });
    }
  });
}

function argumentValue(name, fallback) {
  const index = process.argv.indexOf(name);
  return index >= 0 && process.argv[index + 1] ? process.argv[index + 1] : fallback;
}

const invokedPath = process.argv[1] ? resolve(process.argv[1]) : '';
if (invokedPath === fileURLToPath(import.meta.url)) {
  const sourceDirectory = argumentValue('--source', defaultSourceDirectory);
  const port = Number(argumentValue('--port', '4179'));
  const server = createTransitionEditorServer({ sourceDirectory });
  server.listen(port, '127.0.0.1', () => {
    console.log(`Transition editor: http://127.0.0.1:${port}`);
    console.log(`Bronvideo's: ${resolve(sourceDirectory)}`);
  });
}
