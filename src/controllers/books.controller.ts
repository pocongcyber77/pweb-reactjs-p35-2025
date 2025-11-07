import { Request, Response } from 'express';
import { booksService } from '../services/books.service';
import { createBookSchema, updateBookSchema, bookQuerySchema } from '../utils/validators';
import { Prisma } from '@prisma/client';
import { ZodError } from 'zod';
import { prisma } from '../prisma/client';

// Helper function to transform book from snake_case to camelCase
function transformBook(book: any): any {
  if (!book) return book;
  
  return {
    id: book.id,
    title: book.title,
    writer: book.writer,
    publisher: book.publisher,
    publicationYear: book.publication_year,
    description: book.description,
    coverUrl: book.cover_url,
    price: book.price ? Number(book.price) : book.price,
    stockQuantity: book.stock_quantity,
    genre: book.genre ? {
      id: book.genre.id,
      name: book.genre.name,
    } : undefined,
    createdAt: book.created_at,
    updatedAt: book.updated_at,
  };
}

// Helper function to handle common service errors
function handleServiceError(res: Response, error: any): Response {
    const message = error.message || '';

    if (error instanceof ZodError) {
        // Zod validation failed. Return a detailed 400 Bad Request.
        const issues = error.errors.map(err => {
            // Mengambil path (field) yang error dan pesan errornya
            const path = err.path.join('.');
            return `${path}: ${err.message}`;
        }).join('; ');

        return res.status(400).json({ 
            error: 'Validation failed', 
            details: issues 
        });
    }

    // Database errors (Prisma/PostgreSQL)
    if (error.code === 'P2002') {
        return res.status(409).json({ error: 'Duplicate entry. This record already exists.' });
    }
    
    // PostgreSQL numeric overflow error (dari Prisma ConnectorError)
    const errorString = JSON.stringify(error).toLowerCase();
    if (message.includes('numeric field overflow') || 
        message.includes('must round to an absolute value less than') ||
        errorString.includes('numeric field overflow') ||
        (error.cause && JSON.stringify(error.cause).includes('numeric field overflow'))) {
        return res.status(400).json({ 
            error: 'Nilai terlalu besar. Harga maksimal adalah Rp 99,999,999.99',
            details: 'Field dengan precision 10, scale 2 tidak dapat menampung nilai lebih dari 99,999,999.99'
        });
    }

    // Error: Not Found (e.g., ID tidak ditemukan)
    if (message.includes('not found') || message.includes('ID is invalid')) {
        return res.status(404).json({ error: message });
    }
    
    // Error: Bad Request (e.g., duplikat title, price/stock quantity invalid, tidak bisa dihapus karena relasi)
    if (message.includes('already exists') || message.includes('Cannot delete') || message.includes('non-negative') || message.includes('integer') || message.includes('is required') || message.includes('cannot exceed')) {
        return res.status(400).json({ error: message });
    }

    // Default: Internal Server Error (jika error tidak dikenali)
    console.error('Unhandled Controller Error:', error);
    console.error('Error details:', JSON.stringify(error, null, 2));
    return res.status(500).json({ 
        error: 'An unexpected error occurred',
        details: process.env.NODE_ENV === 'development' ? message : undefined
    });
}

export const booksController = {
  async create(req: Request, res: Response) {
    try {
      const validatedData = createBookSchema.parse(req.body);
      const book = await booksService.create(validatedData);
      
      res.status(201).json({
        message: 'Book created successfully',
        data: transformBook(book),
      });
    } catch (error: any) {
      return handleServiceError(res, error);
    }
  },

  async findAll(req: Request, res: Response) {
    try {
      const { page, limit, search, genre_id, sort, condition } = bookQuerySchema.parse(req.query);
      const result = await booksService.findAll(page, limit, { search, genre_id, sort, condition });
      
      // Transform books from snake_case to camelCase
      const transformedBooks = result.books.map(transformBook);
      
      res.json({
        message: 'Books retrieved successfully',
        data: {
          items: transformedBooks,
          totalPages: result.pagination.totalPages,
          currentPage: result.pagination.page,
          totalItems: result.pagination.total,
        },
      });
    } catch (error) {
      return handleServiceError(res, error);
    }
  },

  async findById(req: Request, res: Response) {
    try {
      const { book_id } = req.params;
      const book = await booksService.findById(book_id);
      
      // Transform book from snake_case to camelCase
      const transformedBook = transformBook(book);
      
      res.json({
        message: 'Book retrieved successfully',
        data: transformedBook,
      });
    } catch (error: any) {
      return handleServiceError(res, error);
    }
  },

  async findByGenre(req: Request, res: Response) {
    try {
      const { genre_id } = req.params;
      const { page, limit } = bookQuerySchema.parse(req.query);
      const result = await booksService.findByGenre(genre_id, page, limit);
      
      // Transform books from snake_case to camelCase
      const transformedBooks = result.books.map(transformBook);
      
      res.json({
        message: 'Books by genre retrieved successfully',
        data: {
          items: transformedBooks,
          totalPages: result.pagination.totalPages,
          currentPage: result.pagination.page,
          totalItems: result.pagination.total,
        },
      });
    } catch (error: any) {
      return handleServiceError(res, error);
    }
  },

  async update(req: Request, res: Response) {
    try {
      const { book_id } = req.params;
      const validatedData = updateBookSchema.parse(req.body);
      const book = await booksService.update(book_id, validatedData);
      
      res.json({
        message: 'Book updated successfully',
        data: transformBook(book),
      });
    } catch (error: any) {
      return handleServiceError(res, error);
    }
  },

  async delete(req: Request, res: Response) {
    try {
      const { book_id } = req.params;
      const result = await booksService.delete(book_id);
      
      res.json({
        message: result.message,
      });
    } catch (error: any) {
      return handleServiceError(res, error);
    }
  },
};
