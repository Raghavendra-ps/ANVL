// Configuration for ANVL Central Hub
export const config = {
  // Database configuration
  database: {
    type: process.env.DB_TYPE || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    name: process.env.DB_NAME || 'anvil_db',
    user: process.env.DB_USER || 'anvil_user',
    password: process.env.DB_PASSWORD || 'anvil_password',
    ssl: process.env.DB_SSL === 'true' || false,
    pool: {
      min: parseInt(process.env.DB_POOL_MIN || '2', 10),
      max: parseInt(process.env.DB_POOL_MAX || '10', 10),
      acquireTimeoutMillis: parseInt(process.env.DB_ACQUIRE_TIMEOUT || '30000', 10),
      idleTimeoutMillis: parseInt(process.env.DB_IDLE_TIMEOUT || '30000', 10)
    }
  },

  // Server configuration
  server: {
    port: parseInt(process.env.PORT || '8083', 10),
    host: process.env.HOST || 'localhost',
    jwtSecret: process.env.JWT_SECRET || 'anvl-default-jwt-secret',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '24h',
    apiPrefix: '/api'
  },

  // Security configuration
  security: {
    rateLimit: {
      windowMs: parseInt(process.env.RATE_LIMIT_WINDOW || '900000', 10), // 15 minutes
      max: parseInt(process.env.RATE_LIMIT_MAX || '100', 10)
    },
    cors: {
      origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : ['*'],
      credentials: process.env.CORS_CREDENTIALS === 'true' || true
    }
  },

  // Logging configuration
  logging: {
    file: process.env.LOG_FILE || '/var/log/anvil/hub.log',
    level: process.env.LOG_LEVEL || 'info',
    format: process.env.LOG_FORMAT || 'json'
  },

  // Performance configuration
  performance: {
    maxPayloadSize: process.env.MAX_PAYLOAD_SIZE || '50mb',
    timeout: parseInt(process.env.REQUEST_TIMEOUT || '30000', 10)
  },

  // Central Hub configuration
  hub: {
    maxRetries: parseInt(process.env.HUB_MAX_RETRIES || '3', 10),
    retryDelay: parseInt(process.env.HUB_RETRY_DELAY || '1000', 10),
    bufferMaxSize: parseInt(process.env.HUB_BUFFER_MAX_SIZE || '1000', 10)
  },

  // API configuration
  api: {
    version: process.env.API_VERSION || 'v1',
    enableSwagger: process.env.ENABLE_SWAGGER === 'true' || false
  }
};