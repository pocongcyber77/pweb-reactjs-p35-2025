-- Migration script untuk update RoleUser enum
-- Jalankan script ini SEBELUM menjalankan `npx prisma db push`

-- Step 1: Update existing data dengan role Kasir menjadi User
UPDATE "user" SET role = 'Admin'::text::role_user_enum WHERE role = 'Kasir'::role_user_enum;
-- Note: Jika ingin Kasir menjadi User, ganti 'Admin' dengan 'User' di atas

-- Step 2: Update existing data dengan role Manager menjadi Admin
UPDATE "user" SET role = 'Admin'::text::role_user_enum WHERE role = 'Manager'::role_user_enum;

-- Step 3: Tambahkan kolom email jika belum ada (opsional, akan dihandle Prisma)
-- ALTER TABLE "user" ADD COLUMN IF NOT EXISTS email VARCHAR(150);

-- Step 4: Hapus constraint unique pada email jika ada duplicate (cek dulu)
-- SELECT email, COUNT(*) FROM "user" WHERE email IS NOT NULL GROUP BY email HAVING COUNT(*) > 1;

-- Step 5: Set email menjadi NULL untuk rows yang duplicate (jika ada)
-- UPDATE "user" SET email = NULL WHERE id_user IN (
--   SELECT id_user FROM (
--     SELECT id_user, ROW_NUMBER() OVER (PARTITION BY email ORDER BY id_user) as rn
--     FROM "user" WHERE email IS NOT NULL
--   ) t WHERE rn > 1
-- );

-- Step 6: Drop dan recreate enum dengan nilai baru
-- Hapus enum lama dan buat yang baru
DROP TYPE IF EXISTS role_user_enum CASCADE;
CREATE TYPE role_user_enum AS ENUM ('User', 'Admin', 'Presiden', 'Dewa');

-- Step 7: Re-add constraint pada kolom role
ALTER TABLE "user" ALTER COLUMN role TYPE role_user_enum USING role::text::role_user_enum;

-- Step 8: Set default role menjadi 'User'
ALTER TABLE "user" ALTER COLUMN role SET DEFAULT 'User'::role_user_enum;

