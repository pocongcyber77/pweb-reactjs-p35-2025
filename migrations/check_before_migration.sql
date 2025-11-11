-- Script untuk mengecek data sebelum migration
-- Jalankan script ini TERLEBIH DAHULU untuk melihat data yang akan terpengaruh

-- 1. Cek user dengan role Kasir
SELECT id_user, username, role
FROM "user" 
WHERE role::text = 'Kasir';

-- 2. Cek user dengan role Manager
SELECT id_user, username, role
FROM "user" 
WHERE role::text = 'Manager';

-- 3. Cek total user per role
SELECT role::text as role, COUNT(*) as count
FROM "user"
GROUP BY role::text;

-- 4. Cek apakah kolom email sudah ada (jika sudah ada, cek duplicate)
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'user' AND column_name = 'email'
    ) THEN
        RAISE NOTICE 'Kolom email sudah ada. Mengecek duplicate...';
        PERFORM email, COUNT(*) as count
        FROM "user" 
        WHERE email IS NOT NULL 
        GROUP BY email 
        HAVING COUNT(*) > 1;
    ELSE
        RAISE NOTICE 'Kolom email belum ada. Akan ditambahkan oleh Prisma.';
    END IF;
END $$;

