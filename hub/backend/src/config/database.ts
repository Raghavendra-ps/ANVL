// Database configuration for ANVL Central Hub
import { Sequelize } from 'sequelize';
import { config } from './config';

// Create Sequelize instance
export const database = new Sequelize(
  config.database.name,
  config.database.user,
  config.database.password,
  {
    host: config.database.host,
    port: config.database.port,
    dialect: config.database.type,
    ssl: config.database.ssl,
    pool: {
      min: config.database.pool.min,
      max: config.database.pool.max,
      acquireTimeoutMillis: config.database.pool.acquireTimeoutMillis,
      idleTimeoutMillis: config.database.pool.idleTimeoutMillis
    },
    logging: false // Set to console.log for SQL logging in development
  }
);

// Test the database connection
export async function testConnection() {
  try {
    await database.authenticate();
    console.log('Database connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    throw error;
  }
}

// Export for use in models
export default database;