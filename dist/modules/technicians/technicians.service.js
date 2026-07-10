import { prisma } from '../../lib/prisma';
import { ApiError } from '../../utils/ApiError';
export const getTechnicianProfile = async (userId) => {
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
export const getAllTechnicians = async (filters) => {
    const where = {};
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
export const updateTechnicianProfile = async (userId, input) => {
    // Build update data - only include fields that are provided
    const data = {};
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
export const addAvailabilitySlot = async (userId, input) => {
    const profile = await prisma.technicianProfile.findUnique({
        where: { userId },
    });
    if (!profile) {
        throw new ApiError(404, 'Technician profile not found');
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
export const getAvailabilitySlots = async (userId) => {
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
export const removeAvailabilitySlot = async (slotId, userId) => {
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
//# sourceMappingURL=technicians.service.js.map