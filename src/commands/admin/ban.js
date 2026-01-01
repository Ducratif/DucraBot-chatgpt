const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { logToLogsChannel } = require('../../utils/logChannel');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Bannir un membre')
    .addUserOption(o => o.setName('membre').setDescription('Membre').setRequired(true))
    .addStringOption(o => o.setName('raison').setDescription('Raison').setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

  async execute({ client, interaction }) {
    const user = interaction.options.getUser('membre', true);
    const reason = interaction.options.getString('raison') || 'Aucune raison';
    const member = await interaction.guild.members.fetch(user.id).catch(() => null);

    if (member && !member.bannable) {
      return interaction.reply({ content: '❌ Je ne peux pas ban ce membre (role trop haut ?).', ephemeral: true });
    }

    await interaction.guild.members.ban(user.id, { reason }).catch((e) => {
      throw new Error(`Ban echoue: ${e.message}`);
    });

    await logToLogsChannel(client, {
      title: '⛔ Ban',
      description: `${interaction.user.tag} a ban ${user.tag}`,
      fields: [
        { name: 'Cible', value: `${user} (\`${user.id}\`)`, inline: false },
        { name: 'Raison', value: reason, inline: false }
      ]
    });

    return interaction.reply({ content: `✅ ${user.tag} a ete banni.\nRaison: **${reason}**`, ephemeral: true });
  }
};
