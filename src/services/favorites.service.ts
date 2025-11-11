import { prisma } from '../prisma/client';

function validateId(id: string, entity: string): void {
  if (!id || typeof id !== 'string' || id.trim() === '') {
    throw new Error(`${entity} ID is invalid or missing`);
  }
}

export const favoritesService = {
  async add(userId: string, bookId: string) {
    validateId(userId, 'User');
    validateId(bookId, 'Book');

    // Check if userId is UUID format (User table) or numeric (AdminUser table)
    // Favorite only supports User model (UUID), not AdminUser
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(userId);
    
    if (!isUUID) {
      throw new Error('Favorites feature is only available for regular users, not admin users');
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      throw new Error('User not found');
    }

    // Check if book exists
    const book = await prisma.book.findUnique({
      where: { id: bookId },
    });
    if (!book) {
      throw new Error('Book not found');
    }

    // Check if already favorited
    const existing = await prisma.favorite.findFirst({
      where: {
        user_id: userId,
        book_id: bookId,
      },
    });

    if (existing) {
      throw new Error('Book is already in favorites');
    }

    // Create favorite
    const favorite = await prisma.favorite.create({
      data: {
        user_id: userId,
        book_id: bookId,
      },
      include: {
        book: {
          include: {
            genre: true,
          },
        },
      },
    });

    return favorite;
  },

  async remove(userId: string, bookId: string) {
    validateId(userId, 'User');
    validateId(bookId, 'Book');

    // Check if userId is UUID format
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(userId);
    
    if (!isUUID) {
      throw new Error('Favorites feature is only available for regular users, not admin users');
    }

    const favorite = await prisma.favorite.findFirst({
      where: {
        user_id: userId,
        book_id: bookId,
      },
    });

    if (!favorite) {
      throw new Error('Favorite not found');
    }

    await prisma.favorite.delete({
      where: {
        id: favorite.id,
      },
    });

    return { message: 'Favorite removed successfully' };
  },

  async isFavorited(userId: string, bookId: string): Promise<boolean> {
    if (!userId || !bookId) return false;
    
    // Check if userId is UUID format
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(userId);
    
    if (!isUUID) {
      // AdminUser cannot use favorites
      return false;
    }
    
    const favorite = await prisma.favorite.findFirst({
      where: {
        user_id: userId,
        book_id: bookId,
      },
    });

    return !!favorite;
  },

  async getUserFavorites(userId: string) {
    validateId(userId, 'User');

    // Check if userId is UUID format (User table) or numeric (AdminUser table)
    // Favorite only supports User model (UUID), not AdminUser
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(userId);
    
    if (!isUUID) {
      // AdminUser cannot use favorites (favorites only for User model)
      // Return empty array instead of error for better UX
      return [];
    }

    const favorites = await prisma.favorite.findMany({
      where: { user_id: userId },
      include: {
        book: {
          include: {
            genre: true,
          },
        },
      },
      orderBy: {
        created_at: 'desc',
      },
    });

    return favorites;
  },
};

