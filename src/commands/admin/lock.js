const { SlashCommandBuilder, PermissionFlagsBits, ChannelType } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('lock')
    .setDescription('Verrouille un salon (plus personne ne parle)')
    .addChannelOption(o => o.setName('channel').setDescription('Salon cible').addChannelTypes(ChannelType.GuildText).setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),

  async execute({ client, interaction }) {
    const ch = interaction.options.getChannel('channel') || interaction.channel;
    await ch.permissionOverwrites.edit(interaction.guild.roles.everyone, { SendMessages: false }).catch((e) => {
      throw new Error(`Lock echoue: ${e.message}`);
    });
    return interaction.reply({ content: `🔒 Salon verrouille: ${ch}`, ephemeral: true });
  }
};
