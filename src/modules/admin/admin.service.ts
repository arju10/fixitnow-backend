import { prisma } from '../../lib/prisma';
import { ApiError } from '../../utils/ApiError';

/**
 * Get dashboard statistics
 */
export const getDashboardStats = async () => {
  try {
    // Get user counts
    const [totalUsers, totalTechnicians, totalCustomers, totalAdmins, bannedUsers] =
      await Promise.all([
        prisma.user.count(),
        prisma.user.count({ where: { role: 'TECHNICIAN' } }),
        prisma.user.count({ where: { role: 'CUSTOMER' } }),
        prisma.user.count({ where: { role: 'ADMIN' } }),
        prisma.user.count({ where: { status: 'BANNED' } }),
      ]);

    // Get booking counts
    const [totalBookings, completedBookings] = await Promise.all([
      prisma.booking.count(),
      prisma.booking.count({ where: { status: 'COMPLETED' } }),
    ]);

    // Get total revenue from completed payments
    const payments = await prisma.payment.aggregate({
      where: { status: 'COMPLETED' },
      _sum: { amount: true },
    });

    // Get recent bookings with relations
    const recentBookings = await prisma.booking.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        service: {
          select: {
            id: true,
            title: true,
          },
        },
        technician: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    return {
      totalUsers,
      totalTechnicians,
      totalCustomers,
      totalAdmins,
      bannedUsers,
      totalBookings,
      completedBookings,
      totalRevenue: payments._sum.amount || 0,
      recentBookings,
    };
  } catch (error) {
    console.error('Dashboard stats error:', error);
    throw new ApiError(500, 'Failed to fetch dashboard statistics');
  }
};

/**
 * Get all users with filters
 */
export const getAllUsers = async (filters?: { role?: string; status?: string }) => {
  try {
    const where: any = {};

    if (filters?.role) {
      where.role = filters.role;
    }

    if (filters?.status) {
      where.status = filters.status;
    }

    const users = await prisma.user.findMany({
      where,
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
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Remove passwords from response
    return users.map(({ password, ...user }) => user);
  } catch (error) {
    console.error('Get users error:', error);
    throw new ApiError(500, 'Failed to fetch users');
  }
};

/**
 * Get all bookings with filters (admin view)
 * ✅ Fixed: Added more logging and error handling
 */
export const getAllBookings = async (filters?: {
  status?: string;
  page?: number;
  limit?: number;
}) => {
  try {
    console.log('📋 getAllBookings called with filters:', filters);

    const page = filters?.page ?? 1;
    const limit = filters?.limit ?? 50;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (filters?.status) {
      where.status = filters.status;
    }

    console.log('📋 Where clause:', where);
    console.log('📋 Skip:', skip, 'Limit:', limit);

    const [bookings, total] = await Promise.all([
      prisma.booking.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
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
      }),
      prisma.booking.count({ where }),
    ]);

    console.log('📋 Found bookings:', bookings.length, 'Total:', total);

    return {
      bookings,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  } catch (error) {
    console.error('Get bookings error:', error);
    throw new ApiError(500, 'Failed to fetch bookings');
  }
};

/**
 * Update user status (ban/unban)
 */
export const updateUserStatus = async (userId: string, status: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { status: status as any },
    });

    const { password, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    console.error('Update user status error:', error);
    throw new ApiError(500, 'Failed to update user status');
  }
};

/**
 * Delete a user (admin only)
 */
export const deleteUser = async (userId: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    await prisma.user.delete({
      where: { id: userId },
    });

    return { message: 'User deleted successfully' };
  } catch (error) {
    if (error instanceof ApiError) throw error;
    console.error('Delete user error:', error);
    throw new ApiError(500, 'Failed to delete user');
  }
};
