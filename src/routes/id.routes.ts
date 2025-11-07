import { Router } from 'express';
import * as c from '../controllers/id.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = Router();

// Buku
router.get('/buku', c.getBukuList);
router.get('/buku/:id', c.getBukuDetail);
router.post('/buku', authenticateToken, c.postBuku);
router.delete('/buku/:id', authenticateToken, c.deleteBukuById);

// Penulis
router.get('/penulis', c.getPenulisList);
router.post('/penulis', authenticateToken, c.postPenulis);

// Admin Users
router.get('/admin/users', authenticateToken, c.getAdminUsers);
router.post('/admin/users', authenticateToken, c.postAdminUser);

// Pelanggan
router.get('/pelanggan', authenticateToken, c.getPelanggan);
router.get('/pelanggan/:id/transaksi', authenticateToken, c.getPelangganTransaksi);

// Transaksi
router.get('/transaksi', authenticateToken, c.getTransaksiList);
router.get('/transaksi/:id', authenticateToken, c.getTransaksiDetail);
router.post('/transaksi', authenticateToken, c.postTransaksi);

export default router;
