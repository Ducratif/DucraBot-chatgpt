const fs = require('node:fs');
const path = require('node:path');
const { Collection } = require('discord.js');

function loadCommands(rootDir) {
  const commands = new Collection();
  const commandsArray = [];

  const base = path.join(rootDir, 'src', 'commands');
  const folders = fs.readdirSync(base, { withFileTypes: true }).filter(d => d.isDirectory()).map(d => d.name);

  for (const folder of folders) {
    const folderPath = path.join(base, folder);
    const files = fs.readdirSync(folderPath).filter(f => f.endsWith('.js'));
    for (const file of files) {
      const filePath = path.join(folderPath, file);
      const cmd = require(filePath);
      if (!cmd?.data || !cmd?.execute) {
        throw new Error(`Commande invalide: ${folder}/${file} (data/execute manquants)`);
      }
      commands.set(cmd.data.name, cmd);
      commandsArray.push(cmd.data.toJSON());
    }
  }

  return { commands, commandsArray };
}

module.exports = { loadCommands };
