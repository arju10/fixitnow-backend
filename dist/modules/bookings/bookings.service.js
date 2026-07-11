import { prisma } from '../../lib/prisma';
import { ApiError } from '../../utils/ApiError';
export const createBooking = async (customerId, input) => {
    const { serviceId, scheduledAt, notes } = input;
    // Check if service exists
    const service = await prisma.service.findUnique({
        where: { id: serviceId },
        include: {
            technician: true,
        },
    });
    if (!service) {
        throw new ApiError(404, 'Service not found');
    }
    // Check if service is active
    if (service.isActive === false) {
        throw new ApiError(400, 'Service is currently not available');
    }
    // Check if technician is available at that time
    const existingBooking = await prisma.booking.findFirst({
        where: {
            technicianId: service.technicianId,
            scheduledAt: scheduledAt,
            status: {
                notIn: ['CANCELLED', 'DECLINED', 'COMPLETED'],
            },
        },
    });
    if (existingBooking) {
        throw new ApiError(409, 'Technician is not available at this time');
    }
    // Create booking
    return prisma.booking.create({
        data: {
            customerId,
            technicianId: service.technicianId,
            serviceId,
            scheduledAt,
            totalAmount: service.price,
            notes: notes || null,
        },
        include: {
            customer: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    phone: true,
                },
            },
            technician: {
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            phone: true,
                        },
                    },
                },
            },
            service: {
                include: {
                    category: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                },
            },
        },
    });
};
export const getBookings = async (userId, role) => {
    const where = {};
    if (role === 'CUSTOMER') {
        where.customerId = userId;
    }
    else if (role === 'TECHNICIAN') {
        const profile = await prisma.technicianProfile.findUnique({
            where: { userId },
        });
        if (profile) {
            where.technicianId = profile.id;
        }
        else {
            throw new ApiError(404, 'Technician profile not found');
        }
    }
    else if (role === 'ADMIN') {
        // Admin can see all bookings
    }
    return prisma.booking.findMany({
        where,
        include: {
            customer: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    phone: true,
                },
            },
            technician: {
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            phone: true,
                        },
                    },
                },
            },
            service: {
                include: {
                    category: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                },
            },
            payment: true,
            review: true,
        },
        orderBy: {
            createdAt: 'desc',
        },
    });
};
export const getBookingById = async (bookingId, userId, role) => {
    const booking = await prisma.booking.findUnique({
        where: { id: bookingId },
        include: {
            customer: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    phone: true,
                },
            },
            technician: {
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            phone: true,
                        },
                    },
                },
            },
            service: {
                include: {
                    category: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                },
            },
            payment: true,
            review: true,
        },
    });
    if (!booking) {
        throw new ApiError(404, 'Booking not found');
    }
    // Check authorization
    const technicianProfile = await prisma.technicianProfile.findUnique({
        where: { userId },
    });
    const isCustomer = booking.customerId === userId;
    const isTechnician = technicianProfile && booking.technicianId === technicianProfile.id;
    const isAdmin = role === 'ADMIN';
    if (!isCustomer && !isTechnician && !isAdmin) {
        throw new ApiError(403, 'You can only view your own bookings');
    }
    return booking;
};
export const updateBookingStatus = async (bookingId, status, userId, role) => {
    const booking = await prisma.booking.findUnique({
        where: { id: bookingId },
        include: {
            technician: true,
        },
    });
    if (!booking) {
        throw new ApiError(404, 'Booking not found');
    }
    // Check authorization (only technician or admin can update status)
    const technicianProfile = await prisma.technicianProfile.findUnique({
        where: { userId },
    });
    const isTechnician = technicianProfile && booking.technicianId === technicianProfile.id;
    const isAdmin = role === 'ADMIN';
    if (!isTechnician && !isAdmin) {
        throw new ApiError(403, 'Only technicians and admins can update booking status');
    }
    // Validate status transition
    const validTransitions = {
        REQUESTED: ['ACCEPTED', 'DECLINED', 'CANCELLED'],
        ACCEPTED: ['PAID', 'CANCELLED'],
        PAID: ['IN_PROGRESS', 'CANCELLED'],
        IN_PROGRESS: ['COMPLETED', 'CANCELLED'],
        COMPLETED: [],
        DECLINED: [],
        CANCELLED: [],
    };
    if (!validTransitions[booking.status]?.includes(status)) {
        throw new ApiError(400, `Invalid status transition from ${booking.status} to ${status}`);
    }
    return prisma.booking.update({
        where: { id: bookingId },
        data: { status: status },
        include: {
            customer: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    phone: true,
                },
            },
            technician: {
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            phone: true,
                        },
                    },
                },
            },
            service: {
                include: {
                    category: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                },
            },
            payment: true,
            review: true,
        },
    });
};
export const cancelBooking = async (bookingId, userId) => {
    const booking = await prisma.booking.findUnique({
        where: { id: bookingId },
    });
    if (!booking) {
        throw new ApiError(404, 'Booking not found');
    }
    // Only customer can cancel their own booking
    if (booking.customerId !== userId) {
        throw new ApiError(403, 'You can only cancel your own bookings');
    }
    // Can't cancel if already in progress or completed
    if (booking.status === 'IN_PROGRESS' || booking.status === 'COMPLETED') {
        throw new ApiError(400, 'Cannot cancel booking that is in progress or completed');
    }
    return prisma.booking.update({
        where: { id: bookingId },
        data: { status: 'CANCELLED' },
        include: {
            customer: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    phone: true,
                },
            },
            technician: {
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            phone: true,
                        },
                    },
                },
            },
            service: {
                include: {
                    category: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                },
            },
        },
    });
};
//# sourceMappingURL=bookings.service.js.map