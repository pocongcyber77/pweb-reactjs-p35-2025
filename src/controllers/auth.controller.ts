import { Request, Response } from 'express';
import { authService } from '../services/auth.service';
import { registerSchema, loginSchema } from '../utils/validators';

// Helper function to handle common service errors
function handleServiceError(res: Response, error: any): Response {
    const message = error?.message || 'Unexpected error';

    // Zod validation errors
    if (error?.name === 'ZodError') {
        const first = error?.issues?.[0]?.message || message;
        return res.status(400).json({ error: first });
    }

    // Prisma known errors
    if (error?.code === 'P2002') {
        return res.status(409).json({ error: 'User with this email already exists' });
    }

    // Error: Not Found
    if (typeof message === 'string' && message.toLowerCase().includes('not found')) {
        return res.status(404).json({ error: message });
    }
    
    // Error: Conflict
    if (typeof message === 'string' && message.toLowerCase().includes('already exists')) {
        return res.status(409).json({ error: message });
    }

    // Error: Unauthorized
    if (typeof message === 'string' && message.toLowerCase().includes('invalid email or password')) {
        return res.status(401).json({ error: message });
    }
    
    // Default
    console.error('Unhandled Controller Error:', error);
    return res.status(500).json({ error: message });
}

export const authController = {
  async register(req: Request, res: Response) {
    try {
      const validatedData = registerSchema.parse(req.body);
      const result = await authService.register(validatedData);
      
      res.status(201).json({
        message: 'User registered successfully',
        data: result,
      });
    } catch (error: any) {
      return handleServiceError(res, error);
    }
  },

  async login(req: Request, res: Response) {
    try {
      const validatedData = loginSchema.parse(req.body);
      const result = await authService.login(validatedData);
      
      res.json({
        message: 'Login successful',
        data: result,
      });
    } catch (error: any) {
      return handleServiceError(res, error);
    }
  },

  async getProfile(req: any, res: Response) {
    try {
      const user = await authService.getProfile(req.user.id);
      
      res.json({
        message: 'Profile retrieved successfully',
        data: user,
      });
    } catch (error: any) {
      return handleServiceError(res, error);
    }
  },
};
