-- Migration: Add condition column to books table
-- Run this to add condition field to existing books table

-- Add condition column to books table if it doesn't exist
ALTER TABLE books 
ADD COLUMN IF NOT EXISTS condition kondisi_buku_enum;

-- Add comment to column
COMMENT ON COLUMN books.condition IS 'Kondisi buku: Baru, Bekas, Berkarat, Berjamur, Kroak, atau Hilang';

