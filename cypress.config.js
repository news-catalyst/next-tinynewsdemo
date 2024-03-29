const { defineConfig } = require('cypress');

module.exports = defineConfig({
  projectId: 'begad4',
  video: false,
  defaultCommandTimeout: 30000,
  env: {
    apiUrl: 'http://localhost:8080/v1/graphql',
  },
  e2e: {
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents(on, config) {
      return require('./cypress/plugins/index.js')(on, config);
    },
    baseUrl: 'http://next-tinynewsdemo.localhost:3000',
    specPattern: 'cypress/e2e/**/*.{js,jsx,ts,tsx}',
  },
  hosts: {
    '*.localhost': '127.0.0.1',
  },
});
