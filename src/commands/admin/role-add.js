const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('role-add')
    .setDescription('Ajouter un role a un membre')
    .addUserOption(o => o.setName('membre').setDescription('Membre').setRequired(true))
    .addRoleOption(o => o.setName('role').setDescription('Role').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles),

  async execute({ client, interaction }) {
    const user = interaction.options.getUser('membre', true);
    const role = interaction.options.getRole('role', true);
    const member = await interaction.guild.members.fetch(user.id).catch(() => null);
    if (!member) return interaction.reply({ content: '❌ Membre introuvable.', ephemeral: true });

    await member.roles.add(role).catch((e) => {
      throw new Error(`Ajout role echoue: ${e.message}`);
    });

    return interaction.reply({ content: `✅ Role ${role} ajoute a ${member}.`, ephemeral: true });
  }
};
