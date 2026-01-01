const { EmbedBuilder } = require('discord.js');

async function logToLogsChannel(client, { title, description, fields }) {
  try {
    if (!client.cfg.features.logs) return;
    const channelId = client.db.getChannel('logsChannelId');
    if (!channelId) return;
    const guild = await client.guilds.fetch(client.cfg.guildId).catch(() => null);
    if (!guild) return;
    const ch = await guild.channels.fetch(channelId).catch(() => null);
    if (!ch || !ch.isTextBased()) return;

    const embed = new EmbedBuilder()
      .setTitle(title || 'Log')
      .setColor(client.cfg.embedColor)
      .setDescription(description || '')
      .setTimestamp(new Date());

    if (Array.isArray(fields) && fields.length) embed.addFields(fields.slice(0, 10));

    await ch.send({ embeds: [embed] }).catch(() => {});
  } catch {
    // noop
  }
}

module.exports = { logToLogsChannel };
