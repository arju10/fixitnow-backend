import { prisma } from '../../lib/prisma';
import { ApiError } from '../../utils/ApiError';
import type {
  UpdateTechnicianProfileInput,
  CreateAvailabilitySlotInput,
  UpdateAvailabilitySlotInput,
} from './technicians.validation';

export const getTechnicianProfile = async (userId: string) => {
  const profile = await prisma.technicianProfile.findUnique({
    where: { userId },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          profileImage: true,
        },
      },
      services: {
        include: {
          category: true,
        },
      },
      availability: true,
      reviews: {
        include: {
          customer: {
            select: {
              id: true,
              name: true,
              profileImage: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      },
    },
  });

  if (!profile) {
    throw new ApiError(404, 'Technician profile not found');
  }

  return profile;
};

export const getAllTechnicians = async (filters?: { location?: string }) => {
  const where: any = {};

  if (filters?.location) {
    where.location = {
      contains: filters.location,
      mode: 'insensitive',
    };
  }

  return prisma.technicianProfile.findMany({
    where,
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          profileImage: true,
        },
      },
      services: {
        include: {
          category: true,
        },
      },
      reviews: {
        select: {
          rating: true,
        },
      },
    },
  });
};

export const updateTechnicianProfile = async (
  userId: string,
  input: UpdateTechnicianProfileInput
) => {
  const data: any = {};

  if (input.bio !== undefined) {
    data.bio = input.bio || null;
  }

  if (input.experienceYrs !== undefined) {
    data.experienceYrs = input.experienceYrs;
  }

  if (input.location !== undefined) {
    data.location = input.location || null;
  }

  const profile = await prisma.technicianProfile.update({
    where: { userId },
    data,
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          profileImage: true,
        },
      },
      services: true,
      availability: true,
    },
  });

  return profile;
};

// Add availability slot
export const addAvailabilitySlot = async (userId: string, input: CreateAvailabilitySlotInput) => {
  const profile = await prisma.technicianProfile.findUnique({
    where: { userId },
  });

  if (!profile) {
    throw new ApiError(404, 'Technician profile not found');
  }

  // Check if slot already exists for this day
  const existingSlot = await prisma.availabilitySlot.findFirst({
    where: {
      technicianId: profile.id,
      dayOfWeek: input.dayOfWeek,
    },
  });

  if (existingSlot) {
    throw new ApiError(409, 'Availability slot already exists for this day');
  }

  return prisma.availabilitySlot.create({
    data: {
      dayOfWeek: input.dayOfWeek,
      startTime: input.startTime,
      endTime: input.endTime,
      isActive: input.isActive ?? true,
      technicianId: profile.id,
    },
  });
};

// Get all availability slots
export const getAvailabilitySlots = async (userId: string) => {
  const profile = await prisma.technicianProfile.findUnique({
    where: { userId },
  });

  if (!profile) {
    throw new ApiError(404, 'Technician profile not found');
  }

  return prisma.availabilitySlot.findMany({
    where: { technicianId: profile.id },
    orderBy: [{ dayOfWeek: 'asc' }, { startTime: 'asc' }],
  });
};

// Update availability slot (day, time, or toggle active)
export const updateAvailabilitySlot = async (
  slotId: string,
  userId: string,
  input: UpdateAvailabilitySlotInput
) => {
  // Check if slot exists and belongs to the technician
  const slot = await prisma.availabilitySlot.findUnique({
    where: { id: slotId },
    include: {
      technician: true,
    },
  });

  if (!slot) {
    throw new ApiError(404, 'Availability slot not found');
  }

  if (slot.technician.userId !== userId) {
    throw new ApiError(403, 'You can only update your own availability slots');
  }

  // If day is being updated, check if another slot exists for that day
  if (input.dayOfWeek !== undefined && input.dayOfWeek !== slot.dayOfWeek) {
    const existingSlot = await prisma.availabilitySlot.findFirst({
      where: {
        technicianId: slot.technicianId,
        dayOfWeek: input.dayOfWeek,
        id: { not: slotId },
      },
    });

    if (existingSlot) {
      throw new ApiError(409, 'Availability slot already exists for this day');
    }
  }

  const data: any = {};
  if (input.dayOfWeek !== undefined) data.dayOfWeek = input.dayOfWeek;
  if (input.startTime !== undefined) data.startTime = input.startTime;
  if (input.endTime !== undefined) data.endTime = input.endTime;
  if (input.isActive !== undefined) data.isActive = input.isActive;

  return prisma.availabilitySlot.update({
    where: { id: slotId },
    data,
  });
};

// Remove availability slot (DELETE - kept for admin or if needed)
export const removeAvailabilitySlot = async (slotId: string, userId: string) => {
  const slot = await prisma.availabilitySlot.findUnique({
    where: { id: slotId },
    include: {
      technician: true,
    },
  });

  if (!slot) {
    throw new ApiError(404, 'Availability slot not found');
  }

  if (slot.technician.userId !== userId) {
    throw new ApiError(403, 'You can only delete your own availability slots');
  }

  await prisma.availabilitySlot.delete({
    where: { id: slotId },
  });
};
