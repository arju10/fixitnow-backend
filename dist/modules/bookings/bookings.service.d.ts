import type { CreateBookingInput } from './bookings.validation';
export declare const createBooking: (customerId: string, input: CreateBookingInput) => Promise<{
    service: {
        category: {
            name: string;
            id: string;
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
    };
    customer: {
        email: string;
        name: string;
        phone: string | null;
        id: string;
    };
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
}>;
export declare const getBookings: (userId: string, role: string) => Promise<({
    service: {
        category: {
            name: string;
            id: string;
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
    customer: {
        email: string;
        name: string;
        phone: string | null;
        id: string;
    };
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
export declare const getBookingById: (bookingId: string, userId: string, role: string) => Promise<{
    service: {
        category: {
            name: string;
            id: string;
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
    customer: {
        email: string;
        name: string;
        phone: string | null;
        id: string;
    };
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
}>;
export declare const updateBookingStatus: (bookingId: string, status: string, userId: string, role: string) => Promise<{
    service: {
        category: {
            name: string;
            id: string;
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
    customer: {
        email: string;
        name: string;
        phone: string | null;
        id: string;
    };
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
}>;
export declare const cancelBooking: (bookingId: string, userId: string) => Promise<{
    service: {
        category: {
            name: string;
            id: string;
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
    };
    customer: {
        email: string;
        name: string;
        phone: string | null;
        id: string;
    };
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
}>;
//# sourceMappingURL=bookings.service.d.ts.map