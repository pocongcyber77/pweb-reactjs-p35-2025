import { Router } from 'express';
import { ordersController } from '../controllers/transactions.controller';
import { authenticateToken, requireAdminRole } from '../middlewares/auth.middleware';

const router = Router();

// Order operations
// Regular users can create orders
router.post('/', authenticateToken, ordersController.create);

// Admin-only routes (require admin role)
router.get('/', authenticateToken, requireAdminRole, ordersController.findAll);
router.get('/statistics', authenticateToken, requireAdminRole, ordersController.getStatistics);
router.get('/:order_id', authenticateToken, requireAdminRole, ordersController.findById);

export default router;
