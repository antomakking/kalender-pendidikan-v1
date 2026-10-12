import fs from 'node:fs';
import path from 'node:path';

const pwaPath = path.resolve('node_modules/vite-plugin-pwa/dist/index.js');
if (fs.existsSync(pwaPath)) {
  let content = fs.readFileSync(pwaPath, 'utf8');
  let changed = false;

  if (content.includes('const _dirname2 = typeof __dirname !== "undefined" ? __dirname : dirname2(fileURLToPath2(import.meta.url));')) {
    content = content.replace(
      'const _dirname2 = typeof __dirname !== "undefined" ? __dirname : dirname2(fileURLToPath2(import.meta.url));',
      'const _dirname2 = dirname2(fileURLToPath2(import.meta.url));'
    );
    changed = true;
  }

  if (content.includes('var _dirname = typeof __dirname !== "undefined" ? __dirname : dirname(fileURLToPath(import.meta.url));')) {
    content = content.replace(
      'var _dirname = typeof __dirname !== "undefined" ? __dirname : dirname(fileURLToPath(import.meta.url));',
      'var _dirname = dirname(fileURLToPath(import.meta.url));'
    );
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(pwaPath, content, 'utf8');
    console.log('[patch-pwa] Successfully patched vite-plugin-pwa __dirname resolution');
  }
}

// Also patch Vite client files to prevent disconnected WebSocket send errors
const viteClientFiles = [
  path.resolve('node_modules/vite/dist/client/client.mjs'),
  path.resolve('node_modules/vite/dist/client/bundledDevClient.mjs'),
];

for (const file of viteClientFiles) {
  if (fs.existsSync(file)) {
    let code = fs.readFileSync(file, 'utf8');
    let patched = false;

    if (code.includes('ws.send(JSON.stringify(data));')) {
      code = code.replace(
        'ws.send(JSON.stringify(data));',
        'if (ws && typeof ws.send === "function" && ws.readyState === 1) { ws.send(JSON.stringify(data)); }'
      );
      patched = true;
    }

    if (code.includes('this.transport.send(payload).catch((err) => {') && !code.includes('String(err).includes("send")')) {
      code = code.replace(
        'this.transport.send(payload).catch((err) => {',
        'this.transport.send(payload).catch((err) => { if (err && String(err).includes("send")) return;'
      );
      patched = true;
    }

    if (code.includes('error: (err) => console.error("[vite]", err),') && !code.includes('String(err).includes("send")')) {
      code = code.replace(
        'error: (err) => console.error("[vite]", err),',
        'error: (err) => { if (err && String(err).includes("send")) return; console.error("[vite]", err); },'
      );
      patched = true;
    }

    if (patched) {
      fs.writeFileSync(file, code, 'utf8');
      console.log('[patch-vite] Successfully patched', file);
    }
  }
}
