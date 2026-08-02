export interface IAdminStats {
  totalUsers: number;
  totalTechnicians: number;
  totalCustomers: number;
  totalAdmins: number;
  bannedUsers: number;
  totalBookings: number;
  completedBookings: number;
  totalRevenue: number;
  recentBookings: any[];
}

export interface IUserFilters {
  role?: string;
  status?: string;
}

export interface IBookingFilters {
  status?: string;
  page?: number;
  limit?: number;
}

export interface IPaginatedResponse<T> {
  bookings: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
