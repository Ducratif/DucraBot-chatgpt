const { SlashCommandBuilder, PermissionFlagsBits, ChannelType } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('say')
    .setDescription('Faire parler le bot')
    .addStringOption(o => o.setName('texte').setDescription('Texte').setRequired(true))
    .addChannelOption(o => o.setName('channel').setDescription('Salon cible (optionnel)').addChannelTypes(ChannelType.GuildText).setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

  async execute({ client, interaction }) {
    const text = interaction.options.getString('texte', true).slice(0, 1900);
    const target = interaction.options.getChannel('channel') || interaction.channel;
    await target.send({ content: text });
    return interaction.reply({ content: `✅ Message envoyé dans ${target}`, ephemeral: true });
  }
};
