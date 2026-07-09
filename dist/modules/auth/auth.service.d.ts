import type { RegisterInput, LoginInput } from './auth.validation';
export declare const registerUser: (input: RegisterInput) => Promise<{
    user: {
        email: string;
        name: string;
        phone: string | null;
        role: import("@prisma/client").$Enums.Role;
        id: string;
        status: import("@prisma/client").$Enums.UserStatus;
        createdAt: Date;
        updatedAt: Date;
    };
    token: string;
}>;
export declare const loginUser: (input: LoginInput) => Promise<{
    user: {
        email: string;
        name: string;
        phone: string | null;
        role: import("@prisma/client").$Enums.Role;
        id: string;
        status: import("@prisma/client").$Enums.UserStatus;
        createdAt: Date;
        updatedAt: Date;
    };
    token: string;
}>;
export declare const getCurrentUser: (userId: string) => Promise<{
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
    email: string;
    name: string;
    phone: string | null;
    role: import("@prisma/client").$Enums.Role;
    id: string;
    status: import("@prisma/client").$Enums.UserStatus;
    createdAt: Date;
    updatedAt: Date;
}>;
//# sourceMappingURL=auth.service.d.ts.map