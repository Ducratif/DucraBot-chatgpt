const { SlashCommandBuilder, PermissionFlagsBits, ChannelType, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('announce')
    .setDescription('Publier une annonce')
    .addStringOption(o => o.setName('texte').setDescription('Texte de l\'annonce').setRequired(true))
    .addChannelOption(o => o.setName('channel').setDescription('Salon cible (optionnel)').addChannelTypes(ChannelType.GuildText).setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

  async execute({ client, interaction }) {
    const text = interaction.options.getString('texte', true).slice(0, 1900);
    const target = interaction.options.getChannel('channel') || (await interaction.guild.channels.fetch(client.db.getChannel('announceChannelId')).catch(() => null)) || interaction.channel;

    const embed = new EmbedBuilder()
      .setTitle('📢 Annonce')
      .setColor(client.cfg.embedColor)
      .setDescription(text)
      .setFooter({ text: `Par ${interaction.user.tag}` })
      .setTimestamp(new Date());

    await target.send({ embeds: [embed] });
    return interaction.reply({ content: `✅ Annonce envoyée dans ${target}`, ephemeral: true });
  }
};
