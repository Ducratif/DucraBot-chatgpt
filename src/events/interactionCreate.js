const { ensureGuild } = require('../utils/guards');

module.exports = {
  name: 'interactionCreate',
  async execute(client, interaction) {
    try {
      if (!interaction.isChatInputCommand()) return;

      if (!ensureGuild(interaction, client.cfg.guildId)) {
        return interaction.reply({
          content: 'Ce bot n\'est pas configuré pour ce serveur.',
          ephemeral: true
        }).catch(() => {});
      }

      const cmd = client.commands.get(interaction.commandName);
      if (!cmd) {
        return interaction.reply({
          content: 'Commande inconnue (re-démarre le bot).',
          ephemeral: true
        }).catch(() => {});
      }

      await cmd.execute({ client, interaction });
    } catch (e) {
      client.logger.error(e?.stack || e?.message || e);
      if (interaction?.isRepliable()) {
        const payload = { content: 'Une erreur est survenue.', ephemeral: true };
        if (interaction.deferred || interaction.replied) {
          return interaction.followUp(payload).catch(() => {});
        }
        return interaction.reply(payload).catch(() => {});
      }
    }
  }
};
