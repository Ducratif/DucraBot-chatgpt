const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('serverinfo')
    .setDescription('Infos sur le serveur'),

  async execute({ client, interaction }) {
    const g = interaction.guild;

    const embed = new EmbedBuilder()
      .setTitle(`🌐 Infos - ${g.name}`)
      .setColor(client.cfg.embedColor)
      .setThumbnail(g.iconURL({ size: 256 }))
      .addFields(
        { name: 'ID', value: `\`${g.id}\``, inline: true },
        { name: 'Propriétaire', value: `<@${g.ownerId}>`, inline: true },
        { name: 'Membres', value: `${g.memberCount}`, inline: true },
        { name: 'Créé le', value: `<t:${Math.floor(g.createdTimestamp / 1000)}:F>`, inline: false }
      );

    return interaction.reply({ embeds: [embed], ephemeral: true });
  }
};
