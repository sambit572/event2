module.exports = {
  apps: [
    {
      name: "backend",
      script: "./index.js", 
      watch: false,
      env: {
        NODE_ENV: "production",
        PORT: 8001,
        FRONTEND_URL: "https://eventsbridge.com",
      },
    },
  ],
};
