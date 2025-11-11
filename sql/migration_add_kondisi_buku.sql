-- Migration: Add new kondisi buku values
-- Run this to update existing enum in database

-- Add new enum values to existing enum type
ALTER TYPE kondisi_buku_enum ADD VALUE IF NOT EXISTS 'Berkarat';
ALTER TYPE kondisi_buku_enum ADD VALUE IF NOT EXISTS 'Berjamur';
ALTER TYPE kondisi_buku_enum ADD VALUE IF NOT EXISTS 'Kroak';
ALTER TYPE kondisi_buku_enum ADD VALUE IF NOT EXISTS 'Hilang';

