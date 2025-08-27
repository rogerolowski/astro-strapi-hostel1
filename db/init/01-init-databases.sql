-- Initialize databases for Hostel Application
-- This script creates the necessary databases and users

-- Create Strapi database and user
CREATE DATABASE strapi_db;
CREATE USER strapi_user WITH PASSWORD 'strapi_password';
GRANT ALL PRIVILEGES ON DATABASE strapi_db TO strapi_user;

-- Create Hostel database and user (if not exists)
CREATE USER hostel_user WITH PASSWORD 'hostel_password';
GRANT ALL PRIVILEGES ON DATABASE hostel_db TO hostel_user;

-- Grant additional privileges for Django migrations
ALTER USER hostel_user CREATEDB;
ALTER USER strapi_user CREATEDB;

-- Connect to hostel_db to set up extensions
\c hostel_db;

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "btree_gin";

-- Connect to strapi_db to set up extensions
\c strapi_db;

-- Enable necessary extensions for Strapi
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "btree_gin";

-- Set default privileges
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO hostel_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO hostel_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON FUNCTIONS TO hostel_user;

ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO strapi_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO strapi_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON FUNCTIONS TO strapi_user;
