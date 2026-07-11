import { sendResponse } from '../../utils/ApiResponse';
import { catchAsync } from '../../utils/catchAsync';
import { prisma } from '../../lib/prisma';
export const getAllUsers = catchAsync(async (req, res) => {
    const { role, status } = req.query;
    const where = {};
    if (role)
        where.role = role;
    if (status)
        where.status = status;
    const users = await prisma.user.findMany({
        where,
        include: {
            technicianProfile: {
                include: {
                    services: true,
                    availability: true,
                },
            },
            bookings: {
                where: {
                    status: {
                        notIn: ['CANCELLED', 'DECLINED'],
                    },
                },
                select: {
                    id: true,
                    status: true,
                    totalAmount: true,
                    scheduledAt: true,
                },
            },
        },
        orderBy: {
            createdAt: 'desc',
        },
    });
    sendResponse(res, 200, 'Users fetched successfully', users);
});
export const getAllBookings = catchAsync(async (req, res) => {
    const { status, fromDate, toDate } = req.query;
    const where = {};
    if (status)
        where.status = status;
    if (fromDate) {
        where.scheduledAt = {
            gte: new Date(fromDate),
        };
    }
    if (toDate) {
        where.scheduledAt = {
            ...where.scheduledAt,
            lte: new Date(toDate),
        };
    }
    const bookings = await prisma.booking.findMany({
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
                    category: true,
                },
            },
            payment: true,
            review: true,
        },
        orderBy: {
            createdAt: 'desc',
        },
    });
    sendResponse(res, 200, 'Bookings fetched successfully', bookings);
});
export const getDashboardStats = catchAsync(async (req, res) => {
    const [totalUsers, totalTechnicians, totalCustomers, totalAdmins, totalBookings, completedBookings, totalRevenue,] = await Promise.all([
        prisma.user.count(),
        prisma.user.count({ where: { role: 'TECHNICIAN' } }),
        prisma.user.count({ where: { role: 'CUSTOMER' } }),
        prisma.user.count({ where: { role: 'ADMIN' } }),
        prisma.booking.count(),
        prisma.booking.count({ where: { status: 'COMPLETED' } }),
        prisma.payment.aggregate({
            where: { status: 'COMPLETED' },
            _sum: {
                amount: true,
            },
        }),
    ]);
    // Get recent bookings
    const recentBookings = await prisma.booking.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
            customer: {
                select: {
                    name: true,
                    email: true,
                },
            },
            service: {
                select: {
                    title: true,
                },
            },
        },
    });
    sendResponse(res, 200, 'Dashboard stats fetched successfully', {
        totalUsers,
        totalTechnicians,
        totalCustomers,
        totalAdmins,
        totalBookings,
        completedBookings,
        totalRevenue: totalRevenue._sum.amount || 0,
        recentBookings,
    });
});
//# sourceMappingURL=admin.controller.js.map