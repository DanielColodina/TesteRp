module.exports = {
  apps: [{
    name: 'rp-empreendimentos',
    script: './src/app.js',
    cwd: __dirname,
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '500M',
    env: {
      NODE_ENV: 'development',
      PORT: 5000,
      HOST: '0.0.0.0'
    },
    exp_backoff_restart_delay: 100,
    kill_timeout: 10000,
    listen_timeout: 5000
  }]
};
