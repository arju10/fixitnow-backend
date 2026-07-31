import { prisma } from '../../lib/prisma';
import { ApiError } from '../../utils/ApiError';
import type {
  UpdateTechnicianProfileInput,
  CreateAvailabilitySlotInput,
  UpdateAvailabilitySlotInput,
} from './technicians.validation';

/**
 * Get technician profile by user ID (for authenticated technician)
 */
export const getTechnicianProfileByUserId = async (userId: string) => {
  console.log('🔍 [Service] Looking for technician with userId:', userId);
  console.log('🔍 [Service] userId type:', typeof userId);
  console.log('🔍 [Service] userId length:', userId?.length);

  // Check if user exists first
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true, role: true },
  });
  console.log('🔍 [Service] User exists:', user ? '✅ YES' : '❌ NO');
  console.log('🔍 [Service] User data:', user);

  // Find the technician profile where userId matches
  const profile = await prisma.technicianProfile.findFirst({
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

  console.log('🔍 [Service] Found profile:', profile ? '✅ YES' : '❌ NO');
  if (profile) {
    console.log('🔍 [Service] Profile ID:', profile.id);
    console.log('🔍 [Service] Profile userId:', profile.userId);
  } else {
    // Check if a technician profile exists at all
    const allProfiles = await prisma.technicianProfile.findMany({
      select: { id: true, userId: true },
    });
    console.log('🔍 [Service] All technician profiles in DB:', allProfiles);
  }

  if (!profile) {
    throw new ApiError(404, 'Technician profile not found');
  }

  return profile;
};

/**
 * Get technician profile by profile ID (for public viewing)
 */
export const getTechnicianProfileByProfileId = async (profileId: string) => {
  console.log('🔍 [Service] Looking for technician with profileId:', profileId);

  const profile = await prisma.technicianProfile.findUnique({
    where: { id: profileId },
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

  console.log('🔍 [Service] Found profile:', profile ? '✅ YES' : '❌ NO');

  if (!profile) {
    throw new ApiError(404, 'Technician profile not found');
  }

  return profile;
};

/**
 * Get all technicians with filters (public)
 */
export const getAllTechnicians = async (filters?: { location?: string }) => {
  const where: any = {};

  if (filters?.location) {
    where.location = {
      contains: filters.location,
      mode: 'insensitive',
    };
  }

  const profiles = await prisma.technicianProfile.findMany({
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

  // Calculate average rating for each technician
  return profiles.map((profile) => ({
    ...profile,
    avgRating:
      profile.reviews.length > 0
        ? profile.reviews.reduce((sum, r) => sum + r.rating, 0) / profile.reviews.length
        : 0,
    totalReviews: profile.reviews.length,
  }));
};

/**
 * Update technician profile
 */
export const updateTechnicianProfile = async (
  userId: string,
  input: UpdateTechnicianProfileInput
) => {
  console.log('🔍 [Service] Updating technician with userId:', userId);

  // First, check if the profile exists
  const existingProfile = await prisma.technicianProfile.findFirst({
    where: { userId },
  });

  console.log('🔍 [Service] Existing profile:', existingProfile ? '✅ YES' : '❌ NO');
  if (existingProfile) {
    console.log('🔍 [Service] Existing profile ID:', existingProfile.id);
  }

  if (!existingProfile) {
    throw new ApiError(404, 'Technician profile not found');
  }

  const data: any = {};
  if (input.bio !== undefined) data.bio = input.bio || null;
  if (input.experienceYrs !== undefined) data.experienceYrs = input.experienceYrs;
  if (input.location !== undefined) data.location = input.location || null;

  const profile = await prisma.technicianProfile.update({
    where: { id: existingProfile.id },
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
      services: {
        include: {
          category: true,
        },
      },
      availability: true,
    },
  });

  return profile;
};

/**
 * Add availability slot
 */
export const addAvailabilitySlot = async (userId: string, input: CreateAvailabilitySlotInput) => {
  console.log('🔍 [Service] Adding availability slot for userId:', userId);

  // Find the technician profile
  const profile = await prisma.technicianProfile.findFirst({
    where: { userId },
  });

  console.log('🔍 [Service] Found profile:', profile ? '✅ YES' : '❌ NO');

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

/**
 * Get all availability slots for a technician (by userId)
 */
export const getAvailabilitySlots = async (userId: string) => {
  console.log('🔍 [Service] Getting availability slots for userId:', userId);
  console.log('🔍 [Service] userId type:', typeof userId);
  console.log('🔍 [Service] userId length:', userId?.length);

  // Find the technician profile
  const profile = await prisma.technicianProfile.findFirst({
    where: { userId },
  });

  console.log('🔍 [Service] Found profile:', profile ? '✅ YES' : '❌ NO');
  if (profile) {
    console.log('🔍 [Service] Profile ID:', profile.id);
    console.log('🔍 [Service] Profile userId:', profile.userId);
  }

  if (!profile) {
    throw new ApiError(404, 'Technician profile not found');
  }

  const slots = await prisma.availabilitySlot.findMany({
    where: { technicianId: profile.id },
    orderBy: [{ dayOfWeek: 'asc' }, { startTime: 'asc' }],
  });

  console.log('🔍 [Service] Found slots:', slots.length);
  return slots;
};

/**
 * Update availability slot
 */
export const updateAvailabilitySlot = async (
  slotId: string,
  userId: string,
  input: UpdateAvailabilitySlotInput
) => {
  console.log('🔍 [Service] Updating availability slot:', slotId, 'for userId:', userId);

  // First, get the technician profile
  const profile = await prisma.technicianProfile.findFirst({
    where: { userId },
  });

  console.log('🔍 [Service] Found profile:', profile ? '✅ YES' : '❌ NO');

  if (!profile) {
    throw new ApiError(404, 'Technician profile not found');
  }

  // Check if slot exists and belongs to this technician
  const slot = await prisma.availabilitySlot.findFirst({
    where: {
      id: slotId,
      technicianId: profile.id,
    },
  });

  console.log('🔍 [Service] Found slot:', slot ? '✅ YES' : '❌ NO');

  if (!slot) {
    throw new ApiError(404, 'Availability slot not found or does not belong to you');
  }

  // If day is being updated, check if another slot exists for that day
  if (input.dayOfWeek !== undefined && input.dayOfWeek !== slot.dayOfWeek) {
    const existingSlot = await prisma.availabilitySlot.findFirst({
      where: {
        technicianId: profile.id,
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

/**
 * Remove availability slot
 */
export const removeAvailabilitySlot = async (slotId: string, userId: string) => {
  console.log('🔍 [Service] Removing availability slot:', slotId, 'for userId:', userId);

  // First, get the technician profile
  const profile = await prisma.technicianProfile.findFirst({
    where: { userId },
  });

  console.log('🔍 [Service] Found profile:', profile ? '✅ YES' : '❌ NO');

  if (!profile) {
    throw new ApiError(404, 'Technician profile not found');
  }

  // Check if slot exists and belongs to this technician
  const slot = await prisma.availabilitySlot.findFirst({
    where: {
      id: slotId,
      technicianId: profile.id,
    },
  });

  console.log('🔍 [Service] Found slot:', slot ? '✅ YES' : '❌ NO');

  if (!slot) {
    throw new ApiError(404, 'Availability slot not found or does not belong to you');
  }

  await prisma.availabilitySlot.delete({
    where: { id: slotId },
  });
};
