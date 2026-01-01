const { logToLogsChannel } = require('../utils/logChannel');

module.exports = {
  name: 'guildMemberRemove',
  async execute(client, member) {
    try {
      await logToLogsChannel(client, {
        title: '👋 Départ',
        description: `${member.user?.tag || member.id} a quitté le serveur.`,
        fields: [{ name: 'ID', value: `${member.id}`, inline: true }]
      });
    } catch {
      // noop
    }
  }
};
