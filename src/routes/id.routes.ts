import { Router } from 'express';
import * as c from '../controllers/id.controller';
import { authenticateToken, requireAdminRole } from '../middlewares/auth.middleware';

const router = Router();

// Buku
router.get('/buku', c.getBukuList);
router.get('/buku/:id', c.getBukuDetail);
router.post('/buku', authenticateToken, requireAdminRole, c.postBuku);
router.delete('/buku/:id', authenticateToken, requireAdminRole, c.deleteBukuById);

// Penulis
router.get('/penulis', c.getPenulisList);
router.post('/penulis', authenticateToken, requireAdminRole, c.postPenulis);

// Admin Users (require admin role)
router.get('/admin/users', authenticateToken, requireAdminRole, c.getAdminUsers);
router.get('/admin/users/:id', authenticateToken, requireAdminRole, c.getAdminUserById);
router.post('/admin/users', authenticateToken, requireAdminRole, c.postAdminUser);
router.put('/admin/users/:id', authenticateToken, requireAdminRole, c.putAdminUser);
router.delete('/admin/users/:id', authenticateToken, requireAdminRole, c.deleteAdminUser);

// Pelanggan (require admin role)
router.get('/pelanggan', authenticateToken, requireAdminRole, c.getPelanggan);
router.get('/pelanggan/:id/transaksi', authenticateToken, requireAdminRole, c.getPelangganTransaksi);

// Transaksi
router.get('/transaksi', authenticateToken, requireAdminRole, c.getTransaksiList);
router.get('/transaksi/:id', authenticateToken, requireAdminRole, c.getTransaksiDetail);
router.post('/transaksi', authenticateToken, c.postTransaksi); // Regular users can create transactions

export default router;
