module.exports = {
  name: 'warn',
  execute(client, info) {
    client.logger.warn('Discord client warn:', info);
  }
};
