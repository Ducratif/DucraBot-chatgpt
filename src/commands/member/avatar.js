const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('avatar')
    .setDescription('Affiche l\'avatar d\'un utilisateur')
    .addUserOption(o => o.setName('utilisateur').setDescription('Utilisateur ciblé').setRequired(false)),

  async execute({ client, interaction }) {
    const user = interaction.options.getUser('utilisateur') || interaction.user;
    const url = user.displayAvatarURL({ size: 1024 });

    const embed = new EmbedBuilder()
      .setTitle(`🖼️ Avatar de ${user.tag}`)
      .setColor(client.cfg.embedColor)
      .setImage(url);

    return interaction.reply({ embeds: [embed], ephemeral: true });
  }
};
