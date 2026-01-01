const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { logToLogsChannel } = require('../../utils/logChannel');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('timeout')
    .setDescription('Timeout un membre (mute temporaire)')
    .addUserOption(o => o.setName('membre').setDescription('Membre').setRequired(true))
    .addIntegerOption(o => o.setName('minutes').setDescription('Duree en minutes').setMinValue(1).setMaxValue(40320).setRequired(true))
    .addStringOption(o => o.setName('raison').setDescription('Raison').setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

  async execute({ client, interaction }) {
    const user = interaction.options.getUser('membre', true);
    const minutes = interaction.options.getInteger('minutes', true);
    const reason = interaction.options.getString('raison') || 'Aucune raison';

    const member = await interaction.guild.members.fetch(user.id).catch(() => null);
    if (!member) return interaction.reply({ content: '❌ Membre introuvable.', ephemeral: true });
    if (!member.moderatable) return interaction.reply({ content: '❌ Je ne peux pas timeout ce membre (role trop haut ?).', ephemeral: true });

    const ms = minutes * 60 * 1000;
    await member.timeout(ms, reason).catch((e) => {
      throw new Error(`Timeout echoue: ${e.message}`);
    });

    await logToLogsChannel(client, {
      title: '⏳ Timeout',
      description: `${interaction.user.tag} a timeout ${user.tag} (${minutes}m)`,
      fields: [
        { name: 'Cible', value: `${user} (\`${user.id}\`)`, inline: false },
        { name: 'Duree', value: `${minutes} minute(s)`, inline: true },
        { name: 'Raison', value: reason, inline: false }
      ]
    });

    return interaction.reply({ content: `✅ ${user.tag} timeout **${minutes}** minute(s).\nRaison: **${reason}**`, ephemeral: true });
  }
};
