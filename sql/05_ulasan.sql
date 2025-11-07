-- Ulasan
CREATE TABLE IF NOT EXISTS ulasan (
	id_ulasan SERIAL PRIMARY KEY,
	id_buku INT NOT NULL REFERENCES buku(id_buku) ON UPDATE CASCADE ON DELETE CASCADE,
	id_pelanggan INT NOT NULL REFERENCES pelanggan(id_pelanggan) ON UPDATE CASCADE ON DELETE CASCADE,
	rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
	komentar TEXT,
	tanggal_ulasan TIMESTAMP NOT NULL DEFAULT NOW(),
	status status_ulasan_enum NOT NULL DEFAULT 'Tampil'
);

CREATE INDEX IF NOT EXISTS idx_ulasan_buku ON ulasan(id_buku);
CREATE INDEX IF NOT EXISTS idx_ulasan_pelanggan ON ulasan(id_pelanggan);
