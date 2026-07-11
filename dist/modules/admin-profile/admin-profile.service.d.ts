import type { UpdateAdminProfileInput } from './admin-profile.validation';
export declare const getAdminProfile: (userId: string) => Promise<{
    adminProfile: {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        department: string | null;
        permissions: string[];
        isSuperAdmin: boolean;
    } | null;
} & {
    email: string;
    password: string;
    name: string;
    phone: string | null;
    role: import("@prisma/client").$Enums.Role;
    id: string;
    profileImage: string | null;
    status: import("@prisma/client").$Enums.UserStatus;
    createdAt: Date;
    updatedAt: Date;
}>;
export declare const updateAdminProfile: (userId: string, input: UpdateAdminProfileInput) => Promise<{
    adminProfile: {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        department: string | null;
        permissions: string[];
        isSuperAdmin: boolean;
    } | null;
} & {
    email: string;
    password: string;
    name: string;
    phone: string | null;
    role: import("@prisma/client").$Enums.Role;
    id: string;
    profileImage: string | null;
    status: import("@prisma/client").$Enums.UserStatus;
    createdAt: Date;
    updatedAt: Date;
}>;
//# sourceMappingURL=admin-profile.service.d.ts.map