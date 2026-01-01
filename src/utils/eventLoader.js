const fs = require('node:fs');
const path = require('node:path');

function loadEvents(client, rootDir) {
  const base = path.join(rootDir, 'src', 'events');
  if (!fs.existsSync(base)) return;

  const files = fs.readdirSync(base).filter(f => f.endsWith('.js'));
  for (const file of files) {
    const filePath = path.join(base, file);
    const evt = require(filePath);

    if (!evt?.name || typeof evt.execute !== 'function') {
      throw new Error(`Event invalide: ${file} (name/execute manquants)`);
    }

    if (evt.once) {
      client.once(evt.name, (...args) => evt.execute(client, ...args));
    } else {
      client.on(evt.name, (...args) => evt.execute(client, ...args));
    }
  }
}

module.exports = { loadEvents };
