import { prisma } from '../../lib/prisma';
import { hashPassword, comparePassword } from '../../utils/hash';
import { signToken } from '../../utils/jwt';
import { ApiError } from '../../utils/ApiError';
import type { RegisterInput, LoginInput } from './auth.validation';
import { Role } from '@prisma/client';

export const registerUser = async (input: RegisterInput) => {
  const { email, password, name, phone, role } = input;

  // Check if user exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new ApiError(409, 'User with this email already exists');
  }

  // Hash password
  const hashedPassword = await hashPassword(password);

  // Create user with transaction
  const user = await prisma.$transaction(async (tx) => {
    const newUser = await tx.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        phone: phone || null,
        role,
      },
    });

    // If technician, create technician profile
    if (role === Role.TECHNICIAN) {
      await tx.technicianProfile.create({
        data: {
          userId: newUser.id,
        },
      });
    }

    return newUser;
  });

  // Generate token
  const token = signToken({
    userId: user.id,
    role: user.role,
  });

  // Remove password from response
  const { password: _, ...userWithoutPassword } = user;

  return {
    user: userWithoutPassword,
    token,
  };
};

export const loginUser = async (input: LoginInput) => {
  const { email, password } = input;

  // Find user
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new ApiError(401, 'Invalid credentials');
  }

  // Check if user is banned
  if (user.status === 'BANNED') {
    throw new ApiError(403, 'Account is banned. Please contact admin');
  }

  // Verify password
  const isPasswordValid = await comparePassword(password, user.password);
  if (!isPasswordValid) {
    throw new ApiError(401, 'Invalid credentials');
  }

  // Generate token
  const token = signToken({
    userId: user.id,
    role: user.role,
  });

  // Remove password from response
  const { password: _, ...userWithoutPassword } = user;

  return {
    user: userWithoutPassword,
    token,
  };
};

export const getCurrentUser = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      technicianProfile: {
        include: {
          services: true,
          availability: true,
        },
      },
    },
  });

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
};
