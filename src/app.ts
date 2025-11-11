import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { errorHandler, notFoundHandler } from './middlewares/error.middleware';

// Import routes
import authRoutes from './routes/auth.routes';
import booksRoutes from './routes/books.routes';
import genreRoutes from './routes/genre.routes';
import transactionsRoutes from './routes/transactions.routes';
import favoritesRoutes from './routes/favorites.routes';
import idRoutes from './routes/id.routes';

// Load environment variables
dotenv.config();

const app = express();

// Security middleware
app.use(helmet());

// CORS configuration
const rawOrigins = process.env.CORS_ORIGINS || process.env.CORS_ORIGIN || 'http://localhost:5173';
const allowedOrigins = rawOrigins.split(',').map(o => o.trim()).filter(Boolean);
app.use(cors({
	origin: (origin, callback) => {
		// allow requests with no origin (like curl or mobile apps)
		if (!origin) return callback(null, true);
		if (allowedOrigins.includes(origin)) return callback(null, true);
		return callback(new Error(`Not allowed by CORS: ${origin}`));
	},
	credentials: true,
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to IT Literature Shop API!',
    data: {
      version: '1.0.0',
      description: 'Backend API for IT Literature Shop - HMIT ITS',
      endpoints: {
        health: '/health',
        auth: '/auth',
        books: '/books',
        genres: '/genre',
        transactions: '/transactions',
        favorites: '/favorites',
        id: '/id'
      }
    },
    timestamp: new Date().toISOString(),
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'IT Literature Shop API is running',
    data: {
      status: 'OK',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    }
  });
});

// API routes
app.use('/auth', authRoutes);
app.use('/books', booksRoutes);
app.use('/genre', genreRoutes);
app.use('/transactions', transactionsRoutes);
app.use('/favorites', favoritesRoutes);
app.use('/id', idRoutes);

// Error handling middleware
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
