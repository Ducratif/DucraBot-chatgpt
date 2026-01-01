const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const EMOJIS = ['1️⃣', '2️⃣', '3️⃣', '4️⃣'];

module.exports = {
  data: new SlashCommandBuilder()
    .setName('poll')
    .setDescription('Créer un sondage')
    .addStringOption(o => o.setName('question').setDescription('Question du sondage').setRequired(true))
    .addStringOption(o => o.setName('choix1').setDescription('Choix 1').setRequired(true))
    .addStringOption(o => o.setName('choix2').setDescription('Choix 2').setRequired(true))
    .addStringOption(o => o.setName('choix3').setDescription('Choix 3').setRequired(false))
    .addStringOption(o => o.setName('choix4').setDescription('Choix 4').setRequired(false)),

  async execute({ client, interaction }) {
    const q = interaction.options.getString('question', true).slice(0, 200);
    const choices = [
      interaction.options.getString('choix1', true),
      interaction.options.getString('choix2', true),
      interaction.options.getString('choix3', false),
      interaction.options.getString('choix4', false)
    ].filter(Boolean).map(s => s.slice(0, 150));

    const lines = choices.map((c, i) => `${EMOJIS[i]}  ${c}`).join('\n');

    const embed = new EmbedBuilder()
      .setTitle('📊 Sondage')
      .setColor(client.cfg.embedColor)
      .setDescription(`**${q}**\n\n${lines}`)
      .setFooter({ text: `Par ${interaction.user.tag}` })
      .setTimestamp(new Date());

    await interaction.reply({ content: '✅ Sondage publié.', ephemeral: true });

    const msg = await interaction.channel.send({ embeds: [embed] });
    for (let i = 0; i < choices.length; i++) {
      await msg.react(EMOJIS[i]).catch(() => {});
    }
  }
};
