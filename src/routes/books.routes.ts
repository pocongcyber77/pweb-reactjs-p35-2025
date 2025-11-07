import { Router } from 'express';
import { booksController } from '../controllers/books.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = Router();

// Public routes (no authentication required)
router.get('/', booksController.findAll);
router.get('/:book_id', booksController.findById);
router.get('/genre/:genre_id', booksController.findByGenre);

// Protected routes (authentication required)
router.post('/', authenticateToken, booksController.create);
router.patch('/:book_id', authenticateToken, booksController.update);
router.delete('/:book_id', authenticateToken, booksController.delete);

export default router;
