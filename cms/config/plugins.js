module.exports = {
  // Import Export Entries Plugin Configuration
  'import-export-entries': {
    enabled: true,
    config: {
      // Server URL for the plugin (adjust based on your setup)
      serverPublicHostname: process.env.PUBLIC_URL || 'http://localhost:1337',
      
      // Enable/disable features
      importOnDraftRelationAttribute: true,
      importOnPublishRelationAttribute: true,
      
      // File size limits (in bytes)
      maxFileSize: 1024 * 1024 * 10, // 10MB
      
      // Allowed file types for import
      allowedFileTypes: ['application/json', 'text/csv', 'application/vnd.ms-excel'],
      
      // Custom field types mapping (if needed)
      customFieldTypesMapping: {
        // Example: 'custom-field-type': 'text'
      },
      
      // Enable logging
      logging: {
        enabled: process.env.NODE_ENV === 'development',
        level: 'info'
      },
      
      // Export settings
      export: {
        // Include timestamps in exports
        includeTimestamps: true,
        // Include relation data
        includeRelations: true,
        // Maximum number of entries per export
        maxEntriesPerExport: 1000
      },
      
      // Import settings
      import: {
        // Allow updating existing entries
        allowUpdate: true,
        // Batch size for processing
        batchSize: 100,
        // Skip entries that cause errors
        skipOnError: false
      }
    },
  },
  
  // Users & Permissions Plugin (already included but configured)
  'users-permissions': {
    enabled: true,
    config: {
      jwt: {
        expiresIn: '7d',
      },
    },
  },
  
  // Internationalization Plugin
  'i18n': {
    enabled: true,
    config: {
      defaultLocale: 'en',
      locales: ['en', 'es', 'fr', 'de'], // Add more locales as needed
    },
  },
  
  // Email Plugin (if you need email functionality)
  email: {
    config: {
      provider: 'nodemailer',
      providerOptions: {
        host: process.env.SMTP_HOST || 'localhost',
        port: process.env.SMTP_PORT || 587,
        auth: {
          user: process.env.SMTP_USERNAME,
          pass: process.env.SMTP_PASSWORD,
        },
        // Use secure connection if available
        secure: process.env.SMTP_SECURE === 'true',
      },
      settings: {
        defaultFrom: process.env.SMTP_DEFAULT_FROM || 'noreply@hostel.local',
        defaultReplyTo: process.env.SMTP_DEFAULT_REPLY_TO || 'support@hostel.local',
      },
    },
  },
  
  // Upload Plugin (for file uploads)
  upload: {
    config: {
      sizeLimit: 256 * 1024 * 1024, // 256mb
      breakpoints: {
        xlarge: 1920,
        large: 1000,
        medium: 750,
        small: 500,
        xsmall: 64
      },
    },
  },
};
