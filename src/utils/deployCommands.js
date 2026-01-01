const { REST, Routes } = require('discord.js');

async function redeployGuildCommands({ token, applicationId, guildId, commandsArray, logger }) {
  const rest = new REST({ version: '10' }).setToken(token);

  // 1) Fetch existing
  let existing = [];
  try {
    existing = await rest.get(Routes.applicationGuildCommands(applicationId, guildId));
  } catch (e) {
    throw new Error(`Impossible de lire les commandes de la guild : ${e.message}`);
  }

  // 2) Delete existing
  for (const cmd of existing) {
    try {
      await rest.delete(Routes.applicationGuildCommand(applicationId, guildId, cmd.id));
    } catch (e) {
      logger?.warn?.(`Suppression commande '${cmd.name}' échouée: ${e.message}`);
    }
  }

  // 3) Register new
  try {
    await rest.put(Routes.applicationGuildCommands(applicationId, guildId), { body: commandsArray });
  } catch (e) {
    throw new Error(`Déploiement commandes échoué : ${e.message}`);
  }
}

module.exports = { redeployGuildCommands };
