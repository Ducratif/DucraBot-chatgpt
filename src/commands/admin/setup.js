const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ChannelType,
  PermissionsBitField
} = require('discord.js');

async function findOrCreateCategory(guild, name) {
  const existing = guild.channels.cache.find(c => c.type === ChannelType.GuildCategory && c.name === name);
  if (existing) return existing;
  return guild.channels.create({ name, type: ChannelType.GuildCategory });
}

async function findOrCreateTextChannel(guild, { name, parentId, overwrites }) {
  const existing = guild.channels.cache.find(c => c.type === ChannelType.GuildText && c.name === name && c.parentId === parentId);
  if (existing) return existing;
  return guild.channels.create({
    name,
    type: ChannelType.GuildText,
    parent: parentId,
    permissionOverwrites: overwrites
  });
}

function overwritesReadOnly({ guild, botId, ownerId, staffRoleId }) {
  const base = [
    { id: guild.roles.everyone.id, deny: [PermissionFlagsBits.SendMessages], allow: [PermissionFlagsBits.ViewChannel] },
    { id: botId, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ManageChannels, PermissionFlagsBits.ManageMessages] },
    { id: ownerId, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ManageMessages] }
  ];
  if (staffRoleId) {
    base.push({ id: staffRoleId, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ManageMessages] });
  }
  return base;
}

function overwritesPrivate({ guild, botId, ownerId, staffRoleId }) {
  const base = [
    { id: guild.roles.everyone.id, deny: [PermissionFlagsBits.ViewChannel] },
    { id: botId, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ManageChannels, PermissionFlagsBits.ManageMessages] },
    { id: ownerId, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ManageMessages] }
  ];
  if (staffRoleId) {
    base.push({ id: staffRoleId, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ManageMessages] });
  }
  return base;
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setup')
    .setDescription('Crée et configure automatiquement les salons du bot')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),

  async execute({ client, interaction }) {
    await interaction.deferReply({ ephemeral: true });

    const guild = interaction.guild;
    const me = guild.members.me;
    const botId = client.user.id;

    // Vérifs permissions
    const needed = new PermissionsBitField([
      PermissionFlagsBits.ManageGuild,
      PermissionFlagsBits.ManageChannels
    ]);
    if (!me.permissions.has(needed)) {
      return interaction.editReply('❌ Il me manque les permissions `Manage Guild` et/ou `Manage Channels`.');
    }

    // Cache
    await guild.channels.fetch().catch(() => {});

    const categoryName = '🤖 DucraBot';
    const category = await findOrCreateCategory(guild, categoryName);
    await client.db.setChannel('categoryId', category.id);

    // Toujours utiles
    const announce = await findOrCreateTextChannel(guild, {
      name: '📢・annonces',
      parentId: category.id,
      overwrites: overwritesReadOnly({ guild, botId, ownerId: client.cfg.ownerId, staffRoleId: client.cfg.staffRoleId })
    });
    await client.db.setChannel('announceChannelId', announce.id);

    const created = [];
    created.push(`# ${announce}`);

    if (client.cfg.features.welcome) {
      const welcome = await findOrCreateTextChannel(guild, {
        name: '👋・bienvenue',
        parentId: category.id,
        overwrites: overwritesReadOnly({ guild, botId, ownerId: client.cfg.ownerId, staffRoleId: client.cfg.staffRoleId })
      });
      await client.db.setChannel('welcomeChannelId', welcome.id);
      created.push(`# ${welcome}`);
    }

    if (client.cfg.features.logs) {
      const logs = await findOrCreateTextChannel(guild, {
        name: '📜・logs',
        parentId: category.id,
        overwrites: overwritesPrivate({ guild, botId, ownerId: client.cfg.ownerId, staffRoleId: client.cfg.staffRoleId })
      });
      await client.db.setChannel('logsChannelId', logs.id);
      created.push(`# ${logs}`);
    }

    if (client.cfg.features.suggestions) {
      const sugg = await findOrCreateTextChannel(guild, {
        name: '💡・suggestions',
        parentId: category.id,
        overwrites: [
          { id: guild.roles.everyone.id, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages] },
          { id: botId, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ManageMessages] }
        ]
      });
      await client.db.setChannel('suggestionsChannelId', sugg.id);
      created.push(`# ${sugg}`);
    }

    if (client.cfg.features.reports) {
      const rep = await findOrCreateTextChannel(guild, {
        name: '🆘・reports',
        parentId: category.id,
        overwrites: overwritesPrivate({ guild, botId, ownerId: client.cfg.ownerId, staffRoleId: client.cfg.staffRoleId })
      });
      await client.db.setChannel('reportsChannelId', rep.id);
      created.push(`# ${rep}`);
    }

    const noteStaff = client.cfg.staffRoleId
      ? `✅ Role staff détecté: <@&${client.cfg.staffRoleId}>`
      : 'ℹ️ (Optionnel) Ajoute `staffRoleId` dans config.json si tu veux donner accès staff aux salons privés.';

    await interaction.editReply([
      '✅ Setup terminé ! Salons configurés :',
      created.join('\n'),
      '',
      noteStaff
    ].join('\n'));
  }
};
