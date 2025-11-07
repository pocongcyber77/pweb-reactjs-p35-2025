-- Core reference tables

CREATE TABLE IF NOT EXISTS penulis (
	id_penulis SERIAL PRIMARY KEY,
	nama_penulis VARCHAR(150) NOT NULL,
	bio TEXT
);

CREATE TABLE IF NOT EXISTS penerbit (
	id_penerbit SERIAL PRIMARY KEY,
	nama_penerbit VARCHAR(150) NOT NULL,
	alamat VARCHAR(255),
	telepon VARCHAR(20)
);

CREATE TABLE IF NOT EXISTS kategori (
	id_kategori SERIAL PRIMARY KEY,
	nama_kategori VARCHAR(100) NOT NULL UNIQUE,
	deskripsi TEXT
);

CREATE TABLE IF NOT EXISTS genre (
	id_genre SERIAL PRIMARY KEY,
	nama_genre VARCHAR(100) NOT NULL UNIQUE,
	deskripsi TEXT
);

CREATE TABLE IF NOT EXISTS bahasa (
	id_bahasa SERIAL PRIMARY KEY,
	nama_bahasa VARCHAR(100) NOT NULL UNIQUE,
	kode_iso VARCHAR(10) NOT NULL UNIQUE
);
