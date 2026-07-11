import type { CreateReviewInput } from './reviews.validation';
export declare const createReview: (customerId: string, input: CreateReviewInput) => Promise<{
    booking: {
        service: {
            id: string;
            title: string;
            price: number;
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
    customer: {
        email: string;
        name: string;
        phone: string | null;
        id: string;
        profileImage: string | null;
    };
    technician: {
        user: {
            email: string;
            name: string;
            phone: string | null;
            id: string;
            profileImage: string | null;
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
    createdAt: Date;
    customerId: string;
    technicianId: string;
    bookingId: string;
    rating: number;
    comment: string | null;
}>;
export declare const getReviewsByTechnician: (technicianId: string) => Promise<({
    booking: {
        service: {
            id: string;
            title: string;
            price: number;
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
    customer: {
        email: string;
        name: string;
        phone: string | null;
        id: string;
        profileImage: string | null;
    };
} & {
    id: string;
    createdAt: Date;
    customerId: string;
    technicianId: string;
    bookingId: string;
    rating: number;
    comment: string | null;
})[]>;
export declare const getMyReviews: (userId: string) => Promise<({
    booking: {
        service: {
            id: string;
            title: string;
            price: number;
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
    customer: {
        email: string;
        name: string;
        phone: string | null;
        id: string;
        profileImage: string | null;
    };
} & {
    id: string;
    createdAt: Date;
    customerId: string;
    technicianId: string;
    bookingId: string;
    rating: number;
    comment: string | null;
})[]>;
export declare const getAverageRating: (technicianId: string) => Promise<{
    averageRating: number;
    totalReviews: number;
}>;
//# sourceMappingURL=reviews.service.d.ts.map