import { Router } from 'express';
import { favoritesController } from '../controllers/favorites.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = Router();

// All favorite routes require authentication
router.use(authenticateToken);

// Favorite operations
router.post('/', favoritesController.add);
router.delete('/:book_id', favoritesController.remove);
router.get('/check/:book_id', favoritesController.check);
router.get('/', favoritesController.getUserFavorites);

export default router;

