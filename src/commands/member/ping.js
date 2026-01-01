const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Affiche la latence du bot'),

  async execute({ client, interaction }) {
    const ws = client.ws.ping;
    await interaction.reply({ content: `🏓 Pong ! Latence WS: **${ws}ms**`, ephemeral: true });
  }
};
