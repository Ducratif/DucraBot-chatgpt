module.exports = {
  name: 'error',
  execute(client, error) {
    client.logger.error('Discord client error:', error?.stack || error?.message || error);
  }
};
