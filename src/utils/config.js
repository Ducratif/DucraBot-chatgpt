const fs = require('node:fs');
const path = require('node:path');
const { z } = require('zod');

const ConfigSchema = z.object({
  guildId: z.string().min(5, 'guildId manquant'),
  ownerId: z.string().min(5, 'ownerId manquant'),
  staffRoleId: z.string().optional().default(''),
  language: z.string().default('fr'),
  embedColor: z.string().regex(/^#?[0-9A-Fa-f]{6}$/, 'embedColor invalide (ex: #5865F2)').default('#5865F2'),
  features: z.object({
    welcome: z.boolean().default(true),
    logs: z.boolean().default(true),
    suggestions: z.boolean().default(true),
    reports: z.boolean().default(true)
  }).default({ welcome: true, logs: true, suggestions: true, reports: true }),
  defaults: z.object({
    welcomeMessage: z.string().min(1).default('👋 Bienvenue {user} sur **{server}** !'),
    autoRoleId: z.string().optional().default('')
  }).default({ welcomeMessage: '👋 Bienvenue {user} sur **{server}** !', autoRoleId: '' })
});

function loadConfig(rootDir) {
  const file = path.join(rootDir, 'config.json');
  if (!fs.existsSync(file)) {
    throw new Error(`config.json introuvable: ${file}`);
  }
  let raw;
  try {
    raw = JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (e) {
    throw new Error(`config.json invalide (JSON): ${e.message}`);
  }

  // Remplace couleur sans #
  if (typeof raw.embedColor === 'string' && !raw.embedColor.startsWith('#')) {
    raw.embedColor = `#${raw.embedColor}`;
  }

  const parsed = ConfigSchema.safeParse(raw);
  if (!parsed.success) {
    const msg = parsed.error.issues.map(i => `- ${i.path.join('.')} : ${i.message}`).join('\n');
    throw new Error(`config.json invalide :\n${msg}`);
  }
  return parsed.data;
}

function loadEnv() {
  const token = process.env.DISCORD_TOKEN;
  if (!token || token.trim().length < 20) {
    throw new Error('DISCORD_TOKEN manquant ou invalide dans .env');
  }
  return {
    token: token.trim(),
    clientId: (process.env.DISCORD_CLIENT_ID || '').trim()
  };
}

module.exports = {
  loadConfig,
  loadEnv,
};
