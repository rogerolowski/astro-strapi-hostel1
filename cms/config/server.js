module.exports = ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  app: {
    keys: env.array('APP_KEYS'),
  },
  admin: {
    url: env('SERVER_ADMIN_URL', '/admin'),
    serveAdminPanel: true,
    auth: {
      secret: env('ADMIN_JWT_SECRET'),
    },
    autoOpen: false,
    watchIgnoreFiles: [
      '**/config/sync/**',
    ],
  },
  webhooks: {
    populateRelations: env.bool('WEBHOOKS_POPULATE_RELATIONS', false),
  },
  settings: {
    cors: {
      enabled: true,
      origin: ['http://localhost:3001', 'http://localhost:4321'],
      credentials: true,
    },
  },
  url: env('PUBLIC_URL', 'http://localhost:3001'),
});
