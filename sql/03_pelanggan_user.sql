-- Pelanggan table
CREATE TABLE IF NOT EXISTS pelanggan (
	id_pelanggan SERIAL PRIMARY KEY,
	nama VARCHAR(150) NOT NULL,
	email VARCHAR(150) NOT NULL UNIQUE,
	no_telp VARCHAR(20),
	alamat VARCHAR(255)
);

-- User (Admin/Kasir/Manager)
CREATE TABLE IF NOT EXISTS "user" (
	id_user SERIAL PRIMARY KEY,
	username VARCHAR(50) NOT NULL UNIQUE,
	password VARCHAR(255) NOT NULL,
	role role_user_enum NOT NULL DEFAULT 'Kasir'
);
