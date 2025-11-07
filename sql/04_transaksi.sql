-- Transaksi & Detail Transaksi

CREATE TABLE IF NOT EXISTS transaksi (
	id_transaksi SERIAL PRIMARY KEY,
	id_pelanggan INT NOT NULL REFERENCES pelanggan(id_pelanggan) ON UPDATE CASCADE,
	tanggal_transaksi TIMESTAMP NOT NULL DEFAULT NOW(),
	total_harga DECIMAL(10,2) NOT NULL CHECK (total_harga >= 0),
	metode_pembayaran VARCHAR(50),
	status status_transaksi_enum NOT NULL DEFAULT 'Pending'
);

CREATE TABLE IF NOT EXISTS detail_transaksi (
	id_detail SERIAL PRIMARY KEY,
	id_transaksi INT NOT NULL REFERENCES transaksi(id_transaksi) ON UPDATE CASCADE ON DELETE CASCADE,
	id_buku INT NOT NULL REFERENCES buku(id_buku) ON UPDATE CASCADE,
	jumlah INT NOT NULL CHECK (jumlah > 0),
	harga_satuan DECIMAL(10,2) NOT NULL CHECK (harga_satuan >= 0),
	subtotal DECIMAL(10,2) GENERATED ALWAYS AS (jumlah * harga_satuan) STORED
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_transaksi_pelanggan ON transaksi(id_pelanggan);
CREATE INDEX IF NOT EXISTS idx_detail_transaksi_transaksi ON detail_transaksi(id_transaksi);
CREATE INDEX IF NOT EXISTS idx_detail_transaksi_buku ON detail_transaksi(id_buku);
