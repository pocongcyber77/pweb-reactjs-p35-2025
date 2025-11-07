-- Buku table

CREATE TABLE IF NOT EXISTS buku (
	id_buku SERIAL PRIMARY KEY,
	isbn VARCHAR(20) UNIQUE,
	judul VARCHAR(255) NOT NULL,
	id_penulis INT NOT NULL REFERENCES penulis(id_penulis) ON UPDATE CASCADE,
	id_penerbit INT NOT NULL REFERENCES penerbit(id_penerbit) ON UPDATE CASCADE,
	id_kategori INT NOT NULL REFERENCES kategori(id_kategori) ON UPDATE CASCADE,
	id_genre INT NOT NULL REFERENCES genre(id_genre) ON UPDATE CASCADE,
	id_bahasa INT NOT NULL REFERENCES bahasa(id_bahasa) ON UPDATE CASCADE,
	tahun_terbit INT,
	tebal_halaman INT,
	dimensi VARCHAR(50),
	berat DECIMAL(6,2),
	kondisi kondisi_buku_enum,
	harga DECIMAL(10,2) NOT NULL CHECK (harga >= 0),
	stok INT NOT NULL DEFAULT 0 CHECK (stok >= 0),
	deskripsi TEXT,
	link_cover VARCHAR(255),
	link_preview VARCHAR(255),
	tanggal_ditambahkan TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Helpful index for title search
CREATE INDEX IF NOT EXISTS idx_buku_judul ON buku USING GIN (to_tsvector('simple', judul));
