import { Request, Response, NextFunction } from 'express';
import { verifyToken, JWTPayload } from '../utils/jwt';
import { prisma } from '../prisma/client';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    username: string | null;
    role?: string;
  };
}

export const authenticateToken = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Access token required' });
    }

    const decoded = verifyToken(token);
    
    // Check if userId is UUID format (User table) or numeric (AdminUser table)
    // UUID format: 8-4-4-4-12 characters (e.g., "550e8400-e29b-41d4-a716-446655440000")
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(decoded.userId);
    
    let user;
    
    if (isUUID) {
      // Try to find user in User table (users) - UUID format
      user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: { id: true, email: true, username: true }
      });
      
      if (user) {
        req.user = {
          ...user,
          role: undefined, // User model doesn't have role
        };
        return next();
      }
    }
    
    // If not found in User table or not UUID format, try AdminUser table (user)
    // Try to parse as integer
    const userIdInt = parseInt(decoded.userId);
    if (!isNaN(userIdInt)) {
      const adminUser = await prisma.adminUser.findUnique({
        where: { id_user: userIdInt },
        select: { id_user: true, email: true, username: true, role: true }
      });

      if (adminUser) {
        // Convert AdminUser to User format for consistency
        req.user = {
          id: adminUser.id_user.toString(),
          email: adminUser.email,
          username: adminUser.username,
          role: adminUser.role,
        };
        return next();
      }
    }

    // User not found in either table
    return res.status(401).json({ error: 'Invalid token' });
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

/**
 * Middleware to require admin role (Admin, Presiden, or Dewa)
 * Must be used after authenticateToken middleware
 */
export const requireAdminRole = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;
  
  if (!user) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  // Check if user has admin role
  const allowedRoles = ['Admin', 'Presiden', 'Dewa'];
  const userRole = user.role;

  if (!userRole || !allowedRoles.includes(userRole)) {
    return res.status(403).json({ 
      error: 'Access denied',
      message: 'Only users with Admin, Presiden, or Dewa role can access this resource'
    });
  }

  next();
};
