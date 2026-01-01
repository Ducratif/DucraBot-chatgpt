const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('userinfo')
    .setDescription('Infos sur un utilisateur')
    .addUserOption(o => o.setName('utilisateur').setDescription('Utilisateur ciblé').setRequired(false)),

  async execute({ client, interaction }) {
    const user = interaction.options.getUser('utilisateur') || interaction.user;
    const member = await interaction.guild.members.fetch(user.id).catch(() => null);

    const embed = new EmbedBuilder()
      .setTitle(`👤 Infos - ${user.tag}`)
      .setColor(client.cfg.embedColor)
      .setThumbnail(user.displayAvatarURL({ size: 256 }))
      .addFields(
        { name: 'ID', value: `\`${user.id}\``, inline: true },
        { name: 'Compte créé', value: `<t:${Math.floor(user.createdTimestamp / 1000)}:F>`, inline: true }
      );

    if (member) {
      embed.addFields(
        { name: 'A rejoint', value: `<t:${Math.floor(member.joinedTimestamp / 1000)}:F>`, inline: true },
        { name: 'Rôles', value: member.roles.cache.filter(r => r.id !== interaction.guildId).map(r => r.toString()).slice(0, 15).join(' ') || 'Aucun', inline: false }
      );
    }

    return interaction.reply({ embeds: [embed], ephemeral: true });
  }
};
