module.exports = {
  name: 'guildMemberAdd',
  async execute(client, member) {
    try {
      if (!client.cfg.features.welcome) return;

      // Auto-role (optionnel)
      const roleId = client.db.data.settings.autoRoleId;
      if (roleId) {
        const role =
          member.guild.roles.cache.get(roleId) ||
          await member.guild.roles.fetch(roleId).catch(() => null);

        if (role) await member.roles.add(role).catch(() => {});
      }

      const channelId = client.db.getChannel('welcomeChannelId');
      if (!channelId) return;

      const ch = await member.guild.channels.fetch(channelId).catch(() => null);
      if (!ch || !ch.isTextBased()) return;

      const template = client.db.data.settings.welcomeMessage || client.cfg.defaults.welcomeMessage;

      const msg = String(template)
        .replaceAll('{user}', `<@${member.id}>`)
        .replaceAll('{server}', member.guild.name);

      await ch.send({ content: msg }).catch(() => {});
    } catch {
      // noop
    }
  }
};
