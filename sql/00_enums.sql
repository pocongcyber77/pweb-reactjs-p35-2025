-- ENUM types
CREATE TYPE kondisi_buku_enum AS ENUM ('Baru', 'Bekas', 'Berkarat', 'Berjamur', 'Kroak', 'Hilang');
CREATE TYPE status_transaksi_enum AS ENUM ('Selesai', 'Pending', 'Dibatalkan');
CREATE TYPE status_ulasan_enum AS ENUM ('Tampil', 'Disembunyikan', 'Dihapus');
CREATE TYPE role_user_enum AS ENUM ('Admin', 'Kasir', 'Manager');
