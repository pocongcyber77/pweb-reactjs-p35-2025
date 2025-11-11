import { Router } from 'express';
import { genreController } from '../controllers/genre.controller';
import { authenticateToken, requireAdminRole } from '../middlewares/auth.middleware';

const router = Router();

// Public routes (no auth required)
router.get('/', genreController.findAll); // List genres - public untuk dropdown
router.get('/:genre_id', genreController.findById); // Get genre by ID - public

// Protected routes (require admin role)
router.post('/', authenticateToken, requireAdminRole, genreController.create);
router.patch('/:genre_id', authenticateToken, requireAdminRole, genreController.update);
router.delete('/:genre_id', authenticateToken, requireAdminRole, genreController.delete);

export default router;
