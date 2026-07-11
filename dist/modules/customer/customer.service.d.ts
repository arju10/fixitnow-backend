import type { UpdateCustomerProfileInput } from './customer.validation';
export declare const getCustomerProfile: (userId: string) => Promise<{
    customerProfile: {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        address: string | null;
        city: string | null;
        postalCode: string | null;
    } | null;
    bookings: ({
        service: {
            category: {
                name: string;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                description: string | null;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            technicianId: string;
            description: string | null;
            categoryId: string;
            title: string;
            price: number;
            durationMins: number;
            isActive: boolean;
        };
        payment: {
            id: string;
            status: import("@prisma/client").$Enums.PaymentStatus;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            amount: number;
            bookingId: string;
            transactionId: string;
            method: string;
            provider: import("@prisma/client").$Enums.PaymentProvider;
            paidAt: Date | null;
        } | null;
        review: {
            id: string;
            createdAt: Date;
            customerId: string;
            technicianId: string;
            bookingId: string;
            rating: number;
            comment: string | null;
        } | null;
        technician: {
            user: {
                email: string;
                name: string;
                phone: string | null;
                id: string;
            };
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
        };
    } & {
        id: string;
        status: import("@prisma/client").$Enums.BookingStatus;
        createdAt: Date;
        updatedAt: Date;
        customerId: string;
        technicianId: string;
        serviceId: string;
        scheduledAt: Date;
        totalAmount: number;
        notes: string | null;
    })[];
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
export declare const updateCustomerProfile: (userId: string, input: UpdateCustomerProfileInput) => Promise<{
    customerProfile: {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        address: string | null;
        city: string | null;
        postalCode: string | null;
    } | null;
    bookings: ({
        service: {
            category: {
                name: string;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                description: string | null;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            technicianId: string;
            description: string | null;
            categoryId: string;
            title: string;
            price: number;
            durationMins: number;
            isActive: boolean;
        };
        payment: {
            id: string;
            status: import("@prisma/client").$Enums.PaymentStatus;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            amount: number;
            bookingId: string;
            transactionId: string;
            method: string;
            provider: import("@prisma/client").$Enums.PaymentProvider;
            paidAt: Date | null;
        } | null;
        review: {
            id: string;
            createdAt: Date;
            customerId: string;
            technicianId: string;
            bookingId: string;
            rating: number;
            comment: string | null;
        } | null;
        technician: {
            user: {
                email: string;
                name: string;
                phone: string | null;
                id: string;
            };
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
        };
    } & {
        id: string;
        status: import("@prisma/client").$Enums.BookingStatus;
        createdAt: Date;
        updatedAt: Date;
        customerId: string;
        technicianId: string;
        serviceId: string;
        scheduledAt: Date;
        totalAmount: number;
        notes: string | null;
    })[];
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
export declare const getCustomerBookings: (userId: string) => Promise<({
    service: {
        category: {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        technicianId: string;
        description: string | null;
        categoryId: string;
        title: string;
        price: number;
        durationMins: number;
        isActive: boolean;
    };
    payment: {
        id: string;
        status: import("@prisma/client").$Enums.PaymentStatus;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        amount: number;
        bookingId: string;
        transactionId: string;
        method: string;
        provider: import("@prisma/client").$Enums.PaymentProvider;
        paidAt: Date | null;
    } | null;
    review: {
        id: string;
        createdAt: Date;
        customerId: string;
        technicianId: string;
        bookingId: string;
        rating: number;
        comment: string | null;
    } | null;
    technician: {
        user: {
            email: string;
            name: string;
            phone: string | null;
            id: string;
        };
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
    };
} & {
    id: string;
    status: import("@prisma/client").$Enums.BookingStatus;
    createdAt: Date;
    updatedAt: Date;
    customerId: string;
    technicianId: string;
    serviceId: string;
    scheduledAt: Date;
    totalAmount: number;
    notes: string | null;
})[]>;
//# sourceMappingURL=customer.service.d.ts.map