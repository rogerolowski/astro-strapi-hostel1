module.exports = {
  apps: [
    {
      name: 'hostel-cms',
      cwd: '/app/cms',
      script: 'yarn',
      args: 'strapi start',
      interpreter: 'none',
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      error_file: '/root/.pm2/logs/cms-error.log',
      out_file: '/root/.pm2/logs/cms-out.log',
      log_file: '/root/.pm2/logs/cms-combined.log',
      time: true,
      env: {
        NODE_ENV: 'production',
        PORT: 1337,
        HOST: '0.0.0.0',
        DATABASE_CLIENT: 'postgres',
        DATABASE_HOST: 'postgres',
        DATABASE_PORT: 5432,
        DATABASE_NAME: process.env.POSTGRES_DB || 'hostel_db',
        DATABASE_USERNAME: process.env.POSTGRES_USER || 'hostel_user',
        DATABASE_PASSWORD: process.env.POSTGRES_PASSWORD,
        JWT_SECRET: process.env.STRAPI_JWT_SECRET,
        ADMIN_JWT_SECRET: process.env.STRAPI_ADMIN_JWT_SECRET,
        APP_KEYS: process.env.STRAPI_APP_KEYS,
        API_TOKEN_SALT: process.env.STRAPI_API_TOKEN_SALT,
        TRANSFER_TOKEN_SALT: process.env.STRAPI_TRANSFER_TOKEN_SALT,
        PUBLIC_URL: process.env.PUBLIC_URL || 'http://localhost',
        STRAPI_DISABLE_UPDATE_NOTIFICATION: true,
        STRAPI_HIDE_STARTUP_MESSAGE: true
      },
      kill_timeout: 5000,
      wait_ready: true,
      listen_timeout: 10000,
      shutdown_with_message: true
    },
    {
      name: 'hostel-frontend',
      cwd: '/app/frontend',
      script: 'node',
      args: './dist/server/entry.mjs',
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      watch: false,
      max_memory_restart: '512M',
      error_file: '/root/.pm2/logs/frontend-error.log',
      out_file: '/root/.pm2/logs/frontend-out.log',
      log_file: '/root/.pm2/logs/frontend-combined.log',
      time: true,
      env: {
        NODE_ENV: 'production',
        HOST: '0.0.0.0',
        PORT: 4321,
        PUBLIC_API_URL: process.env.PUBLIC_API_URL || 'http://localhost/api',
        PUBLIC_CMS_URL: process.env.PUBLIC_CMS_URL || 'http://localhost/strapi'
      },
      kill_timeout: 3000,
      wait_ready: true,
      listen_timeout: 8000
    }
  ],

  // Deployment configuration
  deploy: {
    production: {
      user: 'root',
      host: process.env.DEPLOY_HOST || 'your-server.com',
      ref: 'origin/main',
      repo: process.env.DEPLOY_REPO || 'git@github.com:yourusername/hostel-management.git',
      path: '/opt/hostel-management',
      'pre-deploy-local': '',
      'post-deploy': 'yarn install --production && pm2 reload ecosystem.config.js --env production',
      'pre-setup': '',
      'ssh_options': 'StrictHostKeyChecking=no'
    }
  },

  // PM2 Plus monitoring (optional)
  monitoring: {
    // Set to true to enable PM2 Plus monitoring
    enabled: false,
    // Your PM2 Plus secret key
    secret_key: process.env.PM2_SECRET_KEY,
    // Your PM2 Plus public key  
    public_key: process.env.PM2_PUBLIC_KEY,
    // Machine name
    machine_name: process.env.PM2_MACHINE_NAME || 'hostel-server'
  },

  // Custom configuration for hostel management
  custom: {
    // Health check settings
    health_check: {
      enabled: true,
      interval: '30s',
      timeout: '10s',
      retries: 3,
      endpoints: {
        cms: 'http://localhost:1337/_health',
        frontend: 'http://localhost:4321/'
      }
    },

    // Log rotation settings
    log_rotation: {
      enabled: true,
      max_size: '10M',
      max_files: 5,
      compress: true
    },

    // Performance monitoring
    performance: {
      enabled: true,
      cpu_threshold: 80,
      memory_threshold: 90,
      restart_delay: '5s'
    }
  }
};
