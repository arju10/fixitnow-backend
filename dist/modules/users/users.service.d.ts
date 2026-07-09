import type { UpdateUserInput } from './users.validation';
export declare const getAllUsers: (filters?: {
    role?: string;
    status?: string;
}) => Promise<({
    technicianProfile: ({
        services: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            technicianId: string;
            description: string | null;
            categoryId: string;
            title: string;
            price: number;
            durationMins: number;
        }[];
        availability: {
            id: string;
            createdAt: Date;
            technicianId: string;
            dayOfWeek: number;
            startTime: string;
            endTime: string;
            isActive: boolean;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        bio: string | null;
        experienceYrs: number;
        location: string | null;
        avgRating: number;
        totalReviews: number;
        userId: string;
    }) | null;
} & {
    email: string;
    password: string;
    name: string;
    phone: string | null;
    role: import("@prisma/client").$Enums.Role;
    id: string;
    status: import("@prisma/client").$Enums.UserStatus;
    createdAt: Date;
    updatedAt: Date;
})[]>;
export declare const getUserById: (userId: string) => Promise<{
    technicianProfile: ({
        services: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            technicianId: string;
            description: string | null;
            categoryId: string;
            title: string;
            price: number;
            durationMins: number;
        }[];
        availability: {
            id: string;
            createdAt: Date;
            technicianId: string;
            dayOfWeek: number;
            startTime: string;
            endTime: string;
            isActive: boolean;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        bio: string | null;
        experienceYrs: number;
        location: string | null;
        avgRating: number;
        totalReviews: number;
        userId: string;
    }) | null;
} & {
    email: string;
    password: string;
    name: string;
    phone: string | null;
    role: import("@prisma/client").$Enums.Role;
    id: string;
    status: import("@prisma/client").$Enums.UserStatus;
    createdAt: Date;
    updatedAt: Date;
}>;
export declare const updateUser: (userId: string, input: UpdateUserInput) => Promise<{
    email: string;
    name: string;
    phone: string | null;
    role: import("@prisma/client").$Enums.Role;
    id: string;
    status: import("@prisma/client").$Enums.UserStatus;
    createdAt: Date;
    updatedAt: Date;
}>;
export declare const updateUserStatus: (userId: string, status: string) => Promise<{
    email: string;
    name: string;
    phone: string | null;
    role: import("@prisma/client").$Enums.Role;
    id: string;
    status: import("@prisma/client").$Enums.UserStatus;
    createdAt: Date;
    updatedAt: Date;
}>;
export declare const deleteUser: (userId: string) => Promise<void>;
export declare const getDashboardStats: () => Promise<{
    totalUsers: number;
    totalTechnicians: number;
    totalCustomers: number;
    totalAdmins: number;
    bannedUsers: number;
}>;
//# sourceMappingURL=users.service.d.ts.map