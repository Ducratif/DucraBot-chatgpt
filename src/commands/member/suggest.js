const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('suggest')
    .setDescription('Envoyer une suggestion')
    .addStringOption(o => o.setName('texte').setDescription('Ta suggestion').setRequired(true)),

  async execute({ client, interaction }) {
    if (!client.cfg.features.suggestions) {
      return interaction.reply({ content: '❌ Les suggestions sont désactivées.', ephemeral: true });
    }

    const text = interaction.options.getString('texte', true).slice(0, 1900);
    const channelId = client.db.getChannel('suggestionsChannelId');
    if (!channelId) {
      return interaction.reply({ content: '⚠️ Suggestions non configurées. Utilise `/setup`.', ephemeral: true });
    }

    const ch = await interaction.guild.channels.fetch(channelId).catch(() => null);
    if (!ch || !ch.isTextBased()) {
      return interaction.reply({ content: '⚠️ Le salon de suggestions est introuvable. Relance `/setup`.', ephemeral: true });
    }

    const embed = new EmbedBuilder()
      .setTitle('💡 Nouvelle suggestion')
      .setColor(client.cfg.embedColor)
      .setDescription(text)
      .addFields(
        { name: 'Auteur', value: `${interaction.user} (\`${interaction.user.id}\`)`, inline: false }
      )
      .setTimestamp(new Date());

    await ch.send({ embeds: [embed] }).catch(() => {});

    return interaction.reply({ content: '✅ Suggestion envoyée !', ephemeral: true });
  }
};
