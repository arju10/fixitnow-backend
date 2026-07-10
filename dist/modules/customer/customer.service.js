import { prisma } from '../../lib/prisma';
import { ApiError } from '../../utils/ApiError';
export const getCustomerProfile = async (userId) => {
    // Get user with customer profile
    const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
            customerProfile: true,
            bookings: {
                include: {
                    service: {
                        include: {
                            category: true,
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
                    payment: true,
                    review: true,
                },
                orderBy: {
                    createdAt: 'desc',
                },
            },
        },
    });
    if (!user) {
        throw new ApiError(404, 'Customer not found');
    }
    if (user.role !== 'CUSTOMER') {
        throw new ApiError(400, 'User is not a customer');
    }
    return user;
};
export const updateCustomerProfile = async (userId, input) => {
    // Update User fields
    const userData = {};
    if (input.name !== undefined)
        userData.name = input.name;
    if (input.phone !== undefined)
        userData.phone = input.phone || null;
    // Update CustomerProfile fields
    const profileData = {};
    if (input.address !== undefined)
        profileData.address = input.address || null;
    if (input.city !== undefined)
        profileData.city = input.city || null;
    if (input.postalCode !== undefined)
        profileData.postalCode = input.postalCode || null;
    // Update user and customer profile
    const updatedUser = await prisma.$transaction(async (tx) => {
        // Update user
        const user = await tx.user.update({
            where: { id: userId },
            data: userData,
        });
        // Update or create customer profile
        await tx.customerProfile.upsert({
            where: { userId },
            update: profileData,
            create: {
                userId,
                ...profileData,
            },
        });
        return user;
    });
    // Fetch complete profile
    return getCustomerProfile(userId);
};
export const getCustomerBookings = async (userId) => {
    const bookings = await prisma.booking.findMany({
        where: { customerId: userId },
        include: {
            service: {
                include: {
                    category: true,
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
            payment: true,
            review: true,
        },
        orderBy: {
            createdAt: 'desc',
        },
    });
    return bookings;
};
//# sourceMappingURL=customer.service.js.map