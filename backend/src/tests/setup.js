require('dotenv').config({ path: '.env.test' });
const { app, initializeDatabase } = require('../server');
const db = require('../models');

let server;

beforeAll(async () => {
  try {
    await initializeDatabase();
    server = app.listen(0); // Usar porta aleatória
  } catch (error) {
    console.error('Test database setup failed:', error);
    throw error;
  }
});

afterAll(async () => {
  if (server) {
    await new Promise((resolve) => server.close(resolve));
  }
  await db.sequelize.close();
});
