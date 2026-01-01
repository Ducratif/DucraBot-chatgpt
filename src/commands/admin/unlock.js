const { SlashCommandBuilder, PermissionFlagsBits, ChannelType } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('unlock')
    .setDescription('Deverrouille un salon')
    .addChannelOption(o => o.setName('channel').setDescription('Salon cible').addChannelTypes(ChannelType.GuildText).setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),

  async execute({ client, interaction }) {
    const ch = interaction.options.getChannel('channel') || interaction.channel;
    await ch.permissionOverwrites.edit(interaction.guild.roles.everyone, { SendMessages: null }).catch((e) => {
      throw new Error(`Unlock echoue: ${e.message}`);
    });
    return interaction.reply({ content: `🔓 Salon deverrouille: ${ch}`, ephemeral: true });
  }
};
