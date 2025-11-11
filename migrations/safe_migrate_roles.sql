-- Safe Migration Script untuk RoleUser Enum
-- Jalankan script ini SEBELUM menjalankan `npx prisma db push`

BEGIN;

-- Step 1: Migrate existing data
-- Update Kasir -> User (atau Admin, sesuaikan kebutuhan)
UPDATE "user" 
SET role = 'Admin' 
WHERE role::text = 'Kasir';

-- Update Manager -> Admin
UPDATE "user" 
SET role = 'Admin' 
WHERE role::text = 'Manager';

-- Step 2: Tambahkan kolom email jika belum ada
ALTER TABLE "user" 
ADD COLUMN IF NOT EXISTS email VARCHAR(150);

-- Step 3: Handle duplicate emails (set NULL untuk duplicate)
DO $$
DECLARE
    dup_record RECORD;
BEGIN
    FOR dup_record IN 
        SELECT email, array_agg(id_user) as user_ids
        FROM "user" 
        WHERE email IS NOT NULL 
        GROUP BY email 
        HAVING COUNT(*) > 1
    LOOP
        -- Set email menjadi NULL untuk semua kecuali yang pertama
        UPDATE "user" 
        SET email = NULL 
        WHERE id_user = ANY(dup_record.user_ids[2:array_length(dup_record.user_ids, 1)]);
    END LOOP;
END $$;

-- Step 4: Add unique constraint on email (jika belum ada)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'user_email_key'
    ) THEN
        ALTER TABLE "user" 
        ADD CONSTRAINT user_email_key UNIQUE (email);
    END IF;
END $$;

COMMIT;

-- Setelah script ini selesai, jalankan:
-- npx prisma db push

