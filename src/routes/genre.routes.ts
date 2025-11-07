import { Router } from 'express';
import { genreController } from '../controllers/genre.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = Router();

// Public routes (no auth required)
router.get('/', genreController.findAll); // List genres - public untuk dropdown
router.get('/:genre_id', genreController.findById); // Get genre by ID - public

// Protected routes (auth required)
router.post('/', authenticateToken, genreController.create);
router.patch('/:genre_id', authenticateToken, genreController.update);
router.delete('/:genre_id', authenticateToken, genreController.delete);

export default router;
