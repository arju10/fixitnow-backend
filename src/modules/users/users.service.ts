import { prisma } from '../../lib/prisma';
import { ApiError } from '../../utils/ApiError';
import type { UpdateUserInput } from './users.validation';

export const getAllUsers = async (filters?: { role?: string; status?: string }) => {
  const where: any = {};

  if (filters?.role) {
    where.role = filters.role;
  }

  if (filters?.status) {
    where.status = filters.status;
  }

  return prisma.user.findMany({
    where,
    include: {
      technicianProfile: {
        include: {
          services: true,
          availability: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
};

export const getUserById = async (userId: string) => {
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

  return user;
};

export const updateUser = async (userId: string, input: UpdateUserInput) => {
  // Build update data, only including fields that are provided
  const updateData: any = {};
  if (input.name !== undefined) updateData.name = input.name;
  if (input.phone !== undefined) updateData.phone = input.phone || null;
  if (input.profileImage !== undefined) updateData.profileImage = input.profileImage;

  const user = await prisma.user.update({
    where: { id: userId },
    data: updateData,
  });

  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

export const updateUserStatus = async (userId: string, status: string) => {
  const user = await prisma.user.update({
    where: { id: userId },
    data: { status: status as any },
  });

  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

export const deleteUser = async (userId: string) => {
  await prisma.user.delete({
    where: { id: userId },
  });
};

export const getDashboardStats = async () => {
  const [totalUsers, totalTechnicians, totalCustomers, totalAdmins, bannedUsers] =
    await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { role: 'TECHNICIAN' } }),
      prisma.user.count({ where: { role: 'CUSTOMER' } }),
      prisma.user.count({ where: { role: 'ADMIN' } }),
      prisma.user.count({ where: { status: 'BANNED' } }),
    ]);

  return {
    totalUsers,
    totalTechnicians,
    totalCustomers,
    totalAdmins,
    bannedUsers,
  };
};
