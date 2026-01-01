const { SlashCommandBuilder, PermissionFlagsBits, ChannelType } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('slowmode')
    .setDescription('Definir le slowmode d\'un salon')
    .addIntegerOption(o => o.setName('secondes').setDescription('0 a 21600').setMinValue(0).setMaxValue(21600).setRequired(true))
    .addChannelOption(o => o.setName('channel').setDescription('Salon cible').addChannelTypes(ChannelType.GuildText).setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),

  async execute({ client, interaction }) {
    const s = interaction.options.getInteger('secondes', true);
    const ch = interaction.options.getChannel('channel') || interaction.channel;
    await ch.setRateLimitPerUser(s).catch((e) => {
      throw new Error(`Slowmode echoue: ${e.message}`);
    });
    return interaction.reply({ content: `⏱️ Slowmode de ${ch} defini a **${s}** seconde(s).`, ephemeral: true });
  }
};
