const isDevelopment = process.env.NODE_ENV === 'development';

module.exports = {
  HOST: isDevelopment ? 'localhost' : (process.env.DB_HOST || 'db'),
  USER: process.env.DB_USER || 'user',
  PASSWORD: process.env.DB_PASSWORD || 'password',
  DB: process.env.DB_NAME || 'realflux',
  dialect: "mysql",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  logging: isDevelopment ? console.log : false
};
