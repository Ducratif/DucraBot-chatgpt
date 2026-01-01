function ensureGuild(interaction, guildId) {
  if (!interaction.guildId || interaction.guildId !== guildId) {
    return false;
  }
  return true;
}

function isOwner(userId, ownerId) {
  return String(userId) === String(ownerId);
}

module.exports = { ensureGuild, isOwner };
