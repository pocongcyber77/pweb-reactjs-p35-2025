import bcrypt from 'bcrypt';
import { prisma } from '../prisma/client';
import { generateToken } from '../utils/jwt';

export interface RegisterData {
  email: string;
  password: string;
  username: string;
}

export interface LoginData {
  emailOrUsername: string;
  password: string;
}

export const authService = {
  async register(data: RegisterData) {
    const { email, password, username } = data;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        username,
        created_at: new Date(),
        updated_at: new Date(),
      },
      select: {
        id: true,
        email: true,
        username: true,
        created_at: true,
      },
    });

    // Generate token
    const token = generateToken({
      userId: user.id,
      email: user.email,
    });

    return {
      user,
      token,
    };
  },

  async login(data: LoginData) {
    const { emailOrUsername, password } = data;

    // Check if input is email or username
    const isEmail = emailOrUsername.includes('@');
    
    // Try to find user in User table (users) first
    let user = isEmail
      ? await prisma.user.findUnique({
          where: { email: emailOrUsername },
        })
      : await prisma.user.findFirst({
          where: { username: emailOrUsername },
        });

    let userType: 'User' | 'AdminUser' = 'User';
    let userId: string;
    let userEmail: string;
    let userUsername: string | null;

    // If not found in User table, try AdminUser table (user)
    if (!user) {
      const adminUser = isEmail
        ? await prisma.adminUser.findUnique({
            where: { email: emailOrUsername },
          })
        : await prisma.adminUser.findFirst({
            where: { username: emailOrUsername },
          });

      if (!adminUser) {
        throw new Error('Invalid username/email or password');
      }

      // Verify password for AdminUser
      const isValidPassword = await bcrypt.compare(password, adminUser.password);
      if (!isValidPassword) {
        throw new Error('Invalid username/email or password');
      }

      userType = 'AdminUser';
      userId = adminUser.id_user.toString();
      userEmail = adminUser.email;
      userUsername = adminUser.username;

      // Generate token
      const token = generateToken({
        userId: userId,
        email: userEmail,
      });

      return {
        user: {
          id: userId,
          email: userEmail,
          username: userUsername,
          role: adminUser.role,
        },
        token,
      };
    }

    // Verify password for User
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new Error('Invalid username/email or password');
    }

    // Generate token
    const token = generateToken({
      userId: user.id,
      email: user.email,
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        created_at: user.created_at,
      },
      token,
    };
  },

  async getProfile(userId: string) {
    // Check if userId is UUID format (User table) or numeric (AdminUser table)
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(userId);
    
    if (isUUID) {
      // Try to find in User table (users) - UUID format
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          email: true,
          username: true,
          created_at: true,
        },
      });

      if (user) {
        return user;
      }
    }

    // If not found in User table or not UUID format, try AdminUser table (user)
    const userIdInt = parseInt(userId);
    if (!isNaN(userIdInt)) {
      const adminUser = await prisma.adminUser.findUnique({
        where: { id_user: userIdInt },
      });

      if (adminUser) {
        return {
          id: adminUser.id_user.toString(),
          email: adminUser.email,
          username: adminUser.username,
          role: adminUser.role,
        };
      }
    }

    throw new Error('User not found');
  },
};
