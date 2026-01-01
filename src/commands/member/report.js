const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('report')
    .setDescription('Signaler un membre au staff')
    .addUserOption(o => o.setName('utilisateur').setDescription('Membre a signaler').setRequired(true))
    .addStringOption(o => o.setName('raison').setDescription('Raison').setRequired(true)),

  async execute({ client, interaction }) {
    if (!client.cfg.features.reports) {
      return interaction.reply({ content: '❌ Les reports sont desactives.', ephemeral: true });
    }

    const user = interaction.options.getUser('utilisateur', true);
    const reason = interaction.options.getString('raison', true).slice(0, 1900);
    const channelId = client.db.getChannel('reportsChannelId');

    if (!channelId) {
      return interaction.reply({ content: '⚠️ Reports non configures. Utilise `/setup`.', ephemeral: true });
    }

    const ch = await interaction.guild.channels.fetch(channelId).catch(() => null);
    if (!ch || !ch.isTextBased()) {
      return interaction.reply({ content: '⚠️ Le salon de reports est introuvable. Relance `/setup`.', ephemeral: true });
    }

    const embed = new EmbedBuilder()
      .setTitle('🆘 Nouveau report')
      .setColor(client.cfg.embedColor)
      .addFields(
        { name: 'Auteur', value: `${interaction.user} (\`${interaction.user.id}\`)`, inline: false },
        { name: 'Cible', value: `${user} (\`${user.id}\`)`, inline: false },
        { name: 'Raison', value: reason, inline: false }
      )
      .setTimestamp(new Date());

    await ch.send({ embeds: [embed] }).catch(() => {});

    return interaction.reply({ content: '✅ Report envoye au staff.', ephemeral: true });
  }
};
