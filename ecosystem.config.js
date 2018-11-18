module.exports = {
  /**
   * Application configuration section
   * http://pm2.keymetrics.io/docs/usage/application-declaration/
   */
	apps: [
    {
      name: 'weauth',
      script: 'bin/www',
      // instances: 2,
      // exec_mode: 'cluster',
      max_memory_restart: '600M',
    },
  ]
};
