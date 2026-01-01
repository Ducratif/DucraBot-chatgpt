require('dotenv').config();

const path = require('node:path');
const { Client, GatewayIntentBits, Partials } = require('discord.js');

const logger = require('./utils/logger');
const { loadConfig, loadEnv } = require('./utils/config');
const { JsonDB } = require('./utils/db');
const { loadCommands } = require('./utils/commandLoader');
const { redeployGuildCommands } = require('./utils/deployCommands');
const { ensureGuild } = require('./utils/guards');

(async () => {
  const rootDir = path.resolve(__dirname, '..');

  // 1) Charger & valider config/env
  const cfg = loadConfig(rootDir);
  const env = loadEnv();

  // 2) DB interne
  const db = new JsonDB({ rootDir });
  db.ensure();
  await db.setGuildDefaults({
    guildId: cfg.guildId,
    welcomeMessage: cfg.defaults.welcomeMessage,
    autoRoleId: cfg.defaults.autoRoleId || ''
  });
  await db.incStarts();

  // 3) Client
  const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMembers,
      GatewayIntentBits.GuildMessages
    ],
    partials: [Partials.Channel]
  });

  // 4) Charger commandes
  const { commands, commandsArray } = loadCommands(rootDir);
  client.commands = commands;
  client.cfg = cfg;
  client.env = env;
  client.db = db;
  client.logger = logger;
  client.commandsArray = commandsArray;
  
const { loadEvents } = require('./utils/eventLoader');
loadEvents(client, rootDir);


  // Login
  await client.login(env.token);
})().catch((e) => {
  // Dernière sécurité
  console.error(e);
  process.exitCode = 1;
});
