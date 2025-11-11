import { Router } from 'express';
import { booksController } from '../controllers/books.controller';
import { authenticateToken, requireAdminRole } from '../middlewares/auth.middleware';

const router = Router();

// Public routes (no authentication required)
router.get('/', booksController.findAll);
router.get('/:book_id', booksController.findById);
router.get('/genre/:genre_id', booksController.findByGenre);

// Protected routes (authentication required)
router.post('/', authenticateToken, requireAdminRole, booksController.create);
router.patch('/:book_id', authenticateToken, requireAdminRole, booksController.update);
router.delete('/:book_id', authenticateToken, requireAdminRole, booksController.delete);

export default router;
