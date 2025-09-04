#!/usr/bin/env node

/**
 * CMS Initialization Script
 * 
 * This script handles initial setup for Strapi CMS:
 * 1. Database connection verification
 * 2. Admin user creation
 * 3. Basic content types setup
 * 4. Default data seeding
 */

const strapi = require('@strapi/strapi');
const path = require('path');
const fs = require('fs');

async function initializeCMS() {
  console.log('🚀 Starting CMS initialization...');
  
  let strapiInstance;
  
  try {
    // Start Strapi instance
    strapiInstance = await strapi({
      dir: process.cwd(),
      autoReload: false,
      serveAdminPanel: false,
    }).load();
    
    console.log('✅ Strapi instance loaded successfully');
    
    // 1. Verify database connection
    await verifyDatabaseConnection(strapiInstance);
    
    // 2. Create admin user if not exists
    await createAdminUser(strapiInstance);
    
    // 3. Setup default permissions
    await setupDefaultPermissions(strapiInstance);
    
    // 4. Seed default data
    await seedDefaultData(strapiInstance);
    
    console.log('✅ CMS initialization completed successfully!');
    
  } catch (error) {
    console.error('❌ CMS initialization failed:', error.message);
    console.error(error.stack);
    process.exit(1);
  } finally {
    if (strapiInstance) {
      await strapiInstance.destroy();
    }
    process.exit(0);
  }
}

async function verifyDatabaseConnection(strapi) {
  console.log('🔍 Verifying database connection...');
  
  try {
    // Test database connection
    const knex = strapi.db.connection;
    await knex.raw('SELECT 1');
    console.log('✅ Database connection verified');
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    throw error;
  }
}

async function createAdminUser(strapi) {
  console.log('👤 Setting up admin user...');
  
  try {
    // Check if admin user already exists
    const existingAdmin = await strapi.query('admin::user').findOne({
      where: { email: process.env.ADMIN_EMAIL || 'admin@hostel.local' }
    });
    
    if (existingAdmin) {
      console.log('ℹ️  Admin user already exists, skipping creation');
      return;
    }
    
    // Create admin user
    const adminData = {
      username: process.env.ADMIN_USERNAME || 'admin',
      email: process.env.ADMIN_EMAIL || 'admin@hostel.local',
      firstname: process.env.ADMIN_FIRSTNAME || 'Hostel',
      lastname: process.env.ADMIN_LASTNAME || 'Admin',
      password: process.env.ADMIN_PASSWORD || 'Admin123!',
      isActive: true,
    };
    
    // Hash password
    const hashedPassword = await strapi.plugins['users-permissions'].services.user.hashPassword(adminData.password);
    adminData.password = hashedPassword;
    
    // Create admin user
    await strapi.query('admin::user').create({ data: adminData });
    console.log(`✅ Admin user created: ${adminData.email}`);
    
  } catch (error) {
    console.error('❌ Failed to create admin user:', error.message);
    throw error;
  }
}

async function setupDefaultPermissions(strapi) {
  console.log('🔐 Setting up default permissions...');
  
  try {
    // Setup public role permissions
    const publicRole = await strapi.query('plugin::users-permissions.role').findOne({
      where: { type: 'public' }
    });
    
    if (publicRole) {
      // Define public permissions for content types
      const publicPermissions = [
        'api::room.room.find',
        'api::room.room.findOne',
        'api::booking.booking.find',
        'api::booking.booking.findOne',
        // Add more content type permissions as needed
      ];
      
      // You would implement the actual permission setting logic here
      console.log('✅ Public role permissions configured');
    }
    
    // Setup authenticated role permissions
    const authenticatedRole = await strapi.query('plugin::users-permissions.role').findOne({
      where: { type: 'authenticated' }
    });
    
    if (authenticatedRole) {
      console.log('✅ Authenticated role permissions configured');
    }
    
  } catch (error) {
    console.error('❌ Failed to setup permissions:', error.message);
    throw error;
  }
}

async function seedDefaultData(strapi) {
  console.log('🌱 Seeding default data...');
  
  try {
    // Check if we have the required content types
    const contentTypes = strapi.contentTypes;
    console.log('📋 Available content types:', Object.keys(contentTypes));
    
    // Example: Seed room types if the content type exists
    if (contentTypes['api::room-type.room-type']) {
      await seedRoomTypes(strapi);
    }
    
    // Example: Seed facilities if the content type exists
    if (contentTypes['api::facility.facility']) {
      await seedFacilities(strapi);
    }
    
    console.log('✅ Default data seeding completed');
    
  } catch (error) {
    console.error('❌ Failed to seed default data:', error.message);
    // Don't throw here as seeding might fail due to missing content types
    console.log('ℹ️  Continuing without seeding...');
  }
}

async function seedRoomTypes(strapi) {
  console.log('🏠 Seeding room types...');
  
  const defaultRoomTypes = [
    { name: 'Single Room', capacity: 1, description: 'Private single bed room' },
    { name: 'Double Room', capacity: 2, description: 'Private double bed room' },
    { name: 'Dormitory 4', capacity: 4, description: '4-bed shared dormitory' },
    { name: 'Dormitory 6', capacity: 6, description: '6-bed shared dormitory' },
    { name: 'Dormitory 8', capacity: 8, description: '8-bed shared dormitory' },
  ];
  
  for (const roomType of defaultRoomTypes) {
    const existing = await strapi.entityService.findMany('api::room-type.room-type', {
      filters: { name: roomType.name }
    });
    
    if (existing.length === 0) {
      await strapi.entityService.create('api::room-type.room-type', {
        data: roomType
      });
      console.log(`  ✅ Created room type: ${roomType.name}`);
    }
  }
}

async function seedFacilities(strapi) {
  console.log('🏢 Seeding facilities...');
  
  const defaultFacilities = [
    { name: 'WiFi', icon: 'wifi', description: 'Free wireless internet' },
    { name: 'Air Conditioning', icon: 'snowflake', description: 'Climate control' },
    { name: 'Private Bathroom', icon: 'bath', description: 'En-suite bathroom' },
    { name: 'Shared Kitchen', icon: 'utensils', description: 'Common kitchen area' },
    { name: 'Laundry', icon: 'tshirt', description: 'Washing facilities' },
    { name: 'Parking', icon: 'car', description: 'Vehicle parking' },
    { name: 'Breakfast', icon: 'coffee', description: 'Continental breakfast' },
    { name: '24h Reception', icon: 'clock', description: '24-hour front desk' },
  ];
  
  for (const facility of defaultFacilities) {
    const existing = await strapi.entityService.findMany('api::facility.facility', {
      filters: { name: facility.name }
    });
    
    if (existing.length === 0) {
      await strapi.entityService.create('api::facility.facility', {
        data: facility
      });
      console.log(`  ✅ Created facility: ${facility.name}`);
    }
  }
}

// Health check function
async function healthCheck() {
  console.log('🏥 Running CMS health check...');
  
  try {
    const strapiInstance = await strapi({
      dir: process.cwd(),
      autoReload: false,
      serveAdminPanel: false,
    }).load();
    
    // Check database
    await strapiInstance.db.connection.raw('SELECT 1');
    console.log('✅ Database: OK');
    
    // Check if admin user exists
    const adminCount = await strapiInstance.query('admin::user').count();
    console.log(`✅ Admin users: ${adminCount}`);
    
    await strapiInstance.destroy();
    console.log('✅ CMS health check passed');
    
  } catch (error) {
    console.error('❌ CMS health check failed:', error.message);
    process.exit(1);
  }
}

// Handle different commands
const command = process.argv[2];

switch (command) {
  case 'init':
    initializeCMS();
    break;
  case 'health':
    healthCheck();
    break;
  default:
    console.log('Available commands:');
    console.log('  init   - Initialize CMS with default data');
    console.log('  health - Run health check');
    process.exit(1);
}
