module.exports = ({ env }) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET', 'your-admin-jwt-secret-here-change-in-production'),
  },
  apiToken: {
    salt: env('API_TOKEN_SALT', 'your-api-token-salt-here-change-in-production'),
  },
  transfer: {
    token: {
      salt: env('TRANSFER_TOKEN_SALT', 'your-transfer-token-salt-here-change-in-production'),
    },
  },
});
