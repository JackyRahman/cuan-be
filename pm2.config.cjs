module.exports = {
  apps: [
    {
      name: "cuan-be",
      script: "dist/index.js",
      cwd: "/var/www/cuan-be",
      instances: 1,
      exec_mode: "fork",
      env: {
        NODE_ENV: "production",
        PORT: 4000
      }
    }
  ]
};
