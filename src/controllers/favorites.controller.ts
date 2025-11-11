import { Request, Response } from 'express';
import { favoritesService } from '../services/favorites.service';

function handleServiceError(res: Response, error: any): Response {
  const message = error.message || 'An unexpected error occurred';

  // Database connection errors
  if (error.code === 'P1001') {
    return res.status(503).json({ 
      error: 'Database connection error',
      message: 'Cannot reach database server. Please check your database connection settings or ensure the database is running.',
      details: process.env.NODE_ENV === 'development' ? {
        code: error.code,
        host: error.meta?.database_host,
        port: error.meta?.database_port,
      } : undefined,
    });
  }

  if (message.includes('not found') || message.includes('ID is invalid')) {
    return res.status(404).json({ error: message });
  }

  if (message.includes('already in favorites')) {
    return res.status(400).json({ error: message });
  }

  console.error('Favorites Controller Error:', error);
  return res.status(500).json({ error: message });
}

export const favoritesController = {
  async add(req: any, res: Response) {
    try {
      const userId = req.user.id;
      const { book_id } = req.body;

      if (!book_id) {
        return res.status(400).json({ error: 'Book ID is required' });
      }

      const favorite = await favoritesService.add(userId, book_id);
      
      res.status(201).json({
        message: 'Book added to favorites',
        data: favorite,
      });
    } catch (error: any) {
      return handleServiceError(res, error);
    }
  },

  async remove(req: any, res: Response) {
    try {
      const userId = req.user.id;
      const { book_id } = req.params;

      if (!book_id) {
        return res.status(400).json({ error: 'Book ID is required' });
      }

      await favoritesService.remove(userId, book_id);
      
      res.json({
        message: 'Book removed from favorites',
      });
    } catch (error: any) {
      return handleServiceError(res, error);
    }
  },

  async check(req: any, res: Response) {
    try {
      const userId = req.user.id;
      const { book_id } = req.params;

      if (!book_id) {
        return res.status(400).json({ error: 'Book ID is required' });
      }

      const isFavorited = await favoritesService.isFavorited(userId, book_id);
      
      res.json({
        isFavorited,
      });
    } catch (error: any) {
      return handleServiceError(res, error);
    }
  },

  async getUserFavorites(req: any, res: Response) {
    try {
      const userId = req.user.id;
      const favorites = await favoritesService.getUserFavorites(userId);
      
      res.json({
        message: 'Favorites retrieved successfully',
        data: favorites,
      });
    } catch (error: any) {
      return handleServiceError(res, error);
    }
  },
};

