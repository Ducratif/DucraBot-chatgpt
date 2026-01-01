const { redeployGuildCommands } = require('../utils/deployCommands');

module.exports = {
  name: 'ready',
  once: true,
  async execute(client) {
    const logger = client.logger;
    const cfg = client.cfg;
    const env = client.env;

    try {
      logger.ok(`Connecté en tant que ${client.user.tag}`);

      const guild = await client.guilds.fetch(cfg.guildId).catch(() => null);
      if (!guild) {
        logger.error(`Guild introuvable. Vérifie config.json -> guildId (${cfg.guildId})`);
        process.exitCode = 1;
        return;
      }

      await redeployGuildCommands({
        token: env.token,
        applicationId: client.user.id,
        guildId: cfg.guildId,
        commandsArray: client.commandsArray || [],
        logger
      });

      logger.ok(`Slash commands déployées sur la guild: ${guild.name} (${guild.id})`);

      await client.user.setPresence({
        activities: [{ name: ' /help', type: 0 }],
        status: 'online'
      });
    } catch (e) {
      logger.error(e?.stack || e?.message || e);
      process.exitCode = 1;
    }
  }
};
