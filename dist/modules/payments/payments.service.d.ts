import type { CreatePaymentInput } from './payments.validation';
export declare const createPayment: (userId: string, input: CreatePaymentInput) => Promise<{
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
    };
    clientSecret: string | null;
    paymentIntentId: string;
}>;
export declare const confirmPayment: (paymentIntentId: string) => Promise<{
    booking: {
        service: {
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
        customer: {
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
        };
        technician: {
            user: {
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
    };
} & {
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
}>;
export declare const getPaymentHistory: (userId: string) => Promise<({
    booking: {
        service: {
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
        technician: {
            user: {
                email: string;
                name: string;
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
    };
} & {
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
})[]>;
export declare const getPaymentById: (paymentId: string, userId: string) => Promise<{
    booking: {
        service: {
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
        technician: {
            user: {
                email: string;
                name: string;
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
    };
} & {
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
}>;
export declare const handleStripeWebhook: (event: any) => Promise<void>;
//# sourceMappingURL=payments.service.d.ts.map