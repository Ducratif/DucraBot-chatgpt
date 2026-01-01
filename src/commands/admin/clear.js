const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('clear')
    .setDescription('Supprimer des messages dans ce salon')
    .addIntegerOption(o => o.setName('nombre').setDescription('1 à 100').setMinValue(1).setMaxValue(100).setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

  async execute({ client, interaction }) {
    const n = interaction.options.getInteger('nombre', true);
    await interaction.deferReply({ ephemeral: true });

    const deleted = await interaction.channel.bulkDelete(n, true).catch(() => null);
    if (!deleted) return interaction.editReply('❌ Impossible de supprimer des messages ici.');

    return interaction.editReply(`✅ ${deleted.size} message(s) supprimé(s).`);
  }
};
