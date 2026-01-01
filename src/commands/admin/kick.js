const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { logToLogsChannel } = require('../../utils/logChannel');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('kick')
    .setDescription('Expulser un membre')
    .addUserOption(o => o.setName('membre').setDescription('Membre').setRequired(true))
    .addStringOption(o => o.setName('raison').setDescription('Raison').setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),

  async execute({ client, interaction }) {
    const user = interaction.options.getUser('membre', true);
    const reason = interaction.options.getString('raison') || 'Aucune raison';
    const member = await interaction.guild.members.fetch(user.id).catch(() => null);
    if (!member) return interaction.reply({ content: '❌ Membre introuvable.', ephemeral: true });
    if (!member.kickable) return interaction.reply({ content: '❌ Je ne peux pas kick ce membre (rôle trop haut ?).', ephemeral: true });

    await member.kick(reason).catch((e) => {
      throw new Error(`Kick échoué: ${e.message}`);
    });

    await logToLogsChannel(client, {
      title: '🦵 Kick',
      description: `${interaction.user.tag} a kick ${user.tag}`,
      fields: [
        { name: 'Cible', value: `${user} (\`${user.id}\`)`, inline: false },
        { name: 'Raison', value: reason, inline: false }
      ]
    });

    return interaction.reply({ content: `✅ ${user.tag} a été kick.\nRaison: **${reason}**`, ephemeral: true });
  }
};
