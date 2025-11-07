-- Unique & additional indexes

-- buku
CREATE UNIQUE INDEX IF NOT EXISTS uq_buku_isbn ON buku(isbn);
CREATE INDEX IF NOT EXISTS idx_buku_kategori ON buku(id_kategori);
CREATE INDEX IF NOT EXISTS idx_buku_genre ON buku(id_genre);
CREATE INDEX IF NOT EXISTS idx_buku_bahasa ON buku(id_bahasa);

-- pelanggan
CREATE UNIQUE INDEX IF NOT EXISTS uq_pelanggan_email ON pelanggan(email);

-- user
CREATE UNIQUE INDEX IF NOT EXISTS uq_user_username ON "user"(username);

-- transaksi
CREATE INDEX IF NOT EXISTS idx_transaksi_tanggal ON transaksi(tanggal_transaksi);
