import { prisma } from '../../lib/prisma';
import { ApiError } from '../../utils/ApiError';
import type { UpdateAdminProfileInput } from './admin-profile.validation';

export const getAdminProfile = async (userId: string) => {
  const admin = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      adminProfile: true,
    },
  });

  if (!admin) {
    throw new ApiError(404, 'Admin not found');
  }

  if (admin.role !== 'ADMIN') {
    throw new ApiError(400, 'User is not an admin');
  }

  return admin;
};

export const updateAdminProfile = async (userId: string, input: UpdateAdminProfileInput) => {
  // Check if admin exists
  const admin = await prisma.user.findUnique({
    where: { id: userId },
    include: { adminProfile: true },
  });

  if (!admin) {
    throw new ApiError(404, 'Admin not found');
  }

  if (admin.role !== 'ADMIN') {
    throw new ApiError(400, 'User is not an admin');
  }

  // Build user update data
  const userData: any = {};
  if (input.name !== undefined) userData.name = input.name;
  if (input.phone !== undefined) userData.phone = input.phone || null;

  // Build admin profile update data
  const profileData: any = {};
  if (input.department !== undefined) profileData.department = input.department || null;
  if (input.position !== undefined) profileData.position = input.position || null;
  if (input.permissions !== undefined) profileData.permissions = input.permissions;
  if (input.isSuperAdmin !== undefined) profileData.isSuperAdmin = input.isSuperAdmin;

  // Update user and admin profile
  await prisma.$transaction(async (tx) => {
    // Update user
    await tx.user.update({
      where: { id: userId },
      data: userData,
    });

    // Update or create admin profile
    await tx.adminProfile.upsert({
      where: { userId },
      update: profileData,
      create: {
        userId,
        ...profileData,
      },
    });
  });

  // Return updated profile
  return getAdminProfile(userId);
};
