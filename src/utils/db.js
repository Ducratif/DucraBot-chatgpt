const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');

const DEFAULT_DB = {
  version: 1,
  settings: {
    guildId: '',
    channels: {
      categoryId: '',
      welcomeChannelId: '',
      announceChannelId: '',
      logsChannelId: '',
      suggestionsChannelId: '',
      reportsChannelId: ''
    },
    welcomeMessage: '👋 Bienvenue {user} sur **{server}** !',
    autoRoleId: ''
  },
  stats: {
    startCount: 0,
    lastStartAt: 0
  }
};

function deepMerge(target, source) {
  for (const k of Object.keys(source)) {
    if (source[k] && typeof source[k] === 'object' && !Array.isArray(source[k])) {
      if (!target[k] || typeof target[k] !== 'object') target[k] = {};
      deepMerge(target[k], source[k]);
    } else if (target[k] === undefined) {
      target[k] = source[k];
    }
  }
  return target;
}

class JsonDB {
  constructor({ rootDir }) {
    this.file = path.join(rootDir, 'data', 'db.json');
    this._data = null;
    this._writePromise = Promise.resolve();
  }

  ensure() {
    const dir = path.dirname(this.file);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    if (!fs.existsSync(this.file)) {
      fs.writeFileSync(this.file, JSON.stringify(DEFAULT_DB, null, 2), 'utf8');
    }

    let raw;
    try {
      raw = JSON.parse(fs.readFileSync(this.file, 'utf8'));
    } catch (e) {
      // backup then recreate
      const bak = `${this.file}.corrupt.${Date.now()}`;
      fs.copyFileSync(this.file, bak);
      fs.writeFileSync(this.file, JSON.stringify(DEFAULT_DB, null, 2), 'utf8');
      raw = JSON.parse(fs.readFileSync(this.file, 'utf8'));
    }

    // Apply missing fields (migration)
    const merged = deepMerge(raw, JSON.parse(JSON.stringify(DEFAULT_DB)));
    this._data = merged;
    // Write back if needed
    this._enqueueWrite();
  }

  get data() {
    if (!this._data) throw new Error('DB non initialisée (appelle db.ensure() au démarrage)');
    return this._data;
  }

  _enqueueWrite() {
    const payload = JSON.stringify(this._data, null, 2);
    const tmp = `${this.file}.tmp.${crypto.randomBytes(6).toString('hex')}`;

    this._writePromise = this._writePromise.then(async () => {
      await fs.promises.writeFile(tmp, payload, 'utf8');
      await fs.promises.rename(tmp, this.file);
    }).catch(() => {
      // On évite de crash le bot si la DB est non écrivable.
    });

    return this._writePromise;
  }

  save() {
    return this._enqueueWrite();
  }

  setGuildDefaults({ guildId, welcomeMessage, autoRoleId }) {
    this.data.settings.guildId = guildId;
    if (welcomeMessage) this.data.settings.welcomeMessage = welcomeMessage;
    if (typeof autoRoleId === 'string') this.data.settings.autoRoleId = autoRoleId;
    return this.save();
  }

  setChannel(key, id) {
    if (!key.endsWith('Id')) key = `${key}Id`;
    if (!(key in this.data.settings.channels)) {
      throw new Error(`Clé channel inconnue: ${key}`);
    }
    this.data.settings.channels[key] = id;
    return this.save();
  }

  getChannel(key) {
    if (!key.endsWith('Id')) key = `${key}Id`;
    return this.data.settings.channels[key] || '';
  }

  incStarts() {
    this.data.stats.startCount = (this.data.stats.startCount || 0) + 1;
    this.data.stats.lastStartAt = Date.now();
    return this.save();
  }
}

module.exports = { JsonDB };
