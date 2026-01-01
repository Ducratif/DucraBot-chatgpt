const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { logToLogsChannel } = require('../../utils/logChannel');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('unban')
    .setDescription('Debannir un utilisateur via son ID')
    .addStringOption(o => o.setName('user_id').setDescription('ID Discord').setRequired(true))
    .addStringOption(o => o.setName('raison').setDescription('Raison').setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

  async execute({ client, interaction }) {
    const id = interaction.options.getString('user_id', true).trim();
    const reason = interaction.options.getString('raison') || 'Aucune raison';

    if (!/^\d{15,25}$/.test(id)) {
      return interaction.reply({ content: '❌ ID invalide.', ephemeral: true });
    }

    const ban = await interaction.guild.bans.fetch(id).catch(() => null);
    if (!ban) {
      return interaction.reply({ content: '⚠️ Cet utilisateur n\'est pas banni (ou introuvable).', ephemeral: true });
    }

    await interaction.guild.members.unban(id, reason).catch((e) => {
      throw new Error(`Unban echoue: ${e.message}`);
    });

    await logToLogsChannel(client, {
      title: '✅ Unban',
      description: `${interaction.user.tag} a unban ${ban.user.tag}`,
      fields: [
        { name: 'Cible', value: `${ban.user} (\`${ban.user.id}\`)`, inline: false },
        { name: 'Raison', value: reason, inline: false }
      ]
    });

    return interaction.reply({ content: `✅ ${ban.user.tag} a ete debanni.\nRaison: **${reason}**`, ephemeral: true });
  }
};
