import { prisma } from '../../lib/prisma';
import { hashPassword, comparePassword } from '../../utils/hash';
import { signToken } from '../../utils/jwt';
import { ApiError } from '../../utils/ApiError';
import type { RegisterInput, LoginInput } from './auth.validation';
import { Role } from '@prisma/client';

export const registerUser = async (input: RegisterInput) => {
  const { email, password, name, phone, role } = input;

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new ApiError(409, 'User with this email already exists');
  }

  const hashedPassword = await hashPassword(password);

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

    // Auto create profile based on role
    if (role === Role.TECHNICIAN) {
      await tx.technicianProfile.create({
        data: {
          userId: newUser.id,
        },
      });
    } else if (role === Role.CUSTOMER) {
      await tx.customerProfile.create({
        data: {
          userId: newUser.id,
        },
      });
    } else if (role === Role.ADMIN) {
      await tx.adminProfile.create({
        data: {
          userId: newUser.id,
          isSuperAdmin: false, // First admin can be promoted later
        },
      });
    }

    return newUser;
  });

  const token = signToken({
    userId: user.id,
    role: user.role,
  });

  const { password: _, ...userWithoutPassword } = user;

  return {
    user: userWithoutPassword,
    token,
  };
};

export const loginUser = async (input: LoginInput) => {
  const { email, password } = input;

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new ApiError(401, 'Invalid credentials');
  }

  if (user.status === 'BANNED') {
    throw new ApiError(403, 'Account is banned. Please contact admin');
  }

  const isPasswordValid = await comparePassword(password, user.password);
  if (!isPasswordValid) {
    throw new ApiError(401, 'Invalid credentials');
  }

  const token = signToken({
    userId: user.id,
    role: user.role,
  });

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
      customerProfile: true,
      adminProfile: true,
    },
  });

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
};
