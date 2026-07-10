import type { UpdateTechnicianProfileInput, CreateAvailabilitySlotInput } from './technicians.validation';
export declare const getTechnicianProfile: (userId: string) => Promise<{
    user: {
        email: string;
        name: string;
        phone: string | null;
        id: string;
        profileImage: string | null;
    };
    reviews: ({
        customer: {
            name: string;
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
    })[];
    services: ({
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
    })[];
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
}>;
export declare const getAllTechnicians: (filters?: {
    location?: string;
}) => Promise<({
    user: {
        email: string;
        name: string;
        phone: string | null;
        id: string;
        profileImage: string | null;
    };
    reviews: {
        rating: number;
    }[];
    services: ({
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
    })[];
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
})[]>;
export declare const updateTechnicianProfile: (userId: string, input: UpdateTechnicianProfileInput) => Promise<{
    user: {
        email: string;
        name: string;
        phone: string | null;
        id: string;
        profileImage: string | null;
    };
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
}>;
export declare const addAvailabilitySlot: (userId: string, input: CreateAvailabilitySlotInput) => Promise<{
    id: string;
    createdAt: Date;
    technicianId: string;
    dayOfWeek: number;
    startTime: string;
    endTime: string;
    isActive: boolean;
}>;
export declare const getAvailabilitySlots: (userId: string) => Promise<{
    id: string;
    createdAt: Date;
    technicianId: string;
    dayOfWeek: number;
    startTime: string;
    endTime: string;
    isActive: boolean;
}[]>;
export declare const removeAvailabilitySlot: (slotId: string, userId: string) => Promise<void>;
//# sourceMappingURL=technicians.service.d.ts.map