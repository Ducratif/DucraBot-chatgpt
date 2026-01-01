const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Affiche la liste des commandes'),

  async execute({ client, interaction }) {
    const color = client.cfg.embedColor;

    const member = [
      '`/help`', '`/ping`', '`/avatar`', '`/userinfo`', '`/serverinfo`', '`/suggest`', '`/report`', '`/poll`'
    ].join(' • ');

    const admin = [
      '`/setup`', '`/announce`', '`/say`', '`/clear`', '`/kick`', '`/ban`', '`/unban`', '`/timeout`', '`/lock`', '`/unlock`', '`/slowmode`', '`/role-add`', '`/role-remove`'
    ].join(' • ');

    const embed = new EmbedBuilder()
      .setTitle('📚 Aide - DucraBot')
      .setColor(color)
      .setDescription('Les commandes sont disponibles uniquement sur le serveur configuré.')
      .addFields(
        { name: '👤 Membre', value: member },
        { name: '🛡️ Admin / Modération', value: admin }
      )
      .setFooter({ text: `Guild: ${client.cfg.guildId}` });

    return interaction.reply({ embeds: [embed], ephemeral: true });
  }
};
