module.exports = {
  apps: [
    {
      name: 'aidf-server',
      script: 'npm',
      args: 'start',
      cwd: './server',
      env: {
        PORT: 8008
      }
    },
    {
      name: 'aidf-client', 
      script: 'npm',
      args: 'start',
      cwd: './client',
      env: {
        PORT: 3002
      }
    }
  ]
};