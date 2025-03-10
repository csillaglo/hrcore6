-- Enable the uuid-ossp extension (if not already enabled)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Add access_time column to companies (if it doesn't exist)
ALTER TABLE companies
ADD COLUMN IF NOT EXISTS access_time text;
