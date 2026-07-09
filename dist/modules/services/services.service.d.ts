import type { CreateServiceInput, UpdateServiceInput } from './services.validation';
export declare const getAllServices: (filters?: {
    categoryId?: string;
    minPrice?: number;
    maxPrice?: number;
    minRating?: number;
}) => Promise<({
    category: {
        name: string;
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
    createdAt: Date;
    updatedAt: Date;
    technicianId: string;
    description: string | null;
    categoryId: string;
    title: string;
    price: number;
    durationMins: number;
})[]>;
export declare const getSingleService: (serviceId: string) => Promise<{
    category: {
        name: string;
        id: string;
    };
    technician: {
        user: {
            email: string;
            name: string;
            phone: string | null;
            id: string;
        };
        reviews: ({
            customer: {
                name: string;
                id: string;
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
}>;
export declare const getServicesByTechnicianId: (technicianId: string) => Promise<({
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
})[]>;
export declare const createNewService: (technicianId: string, input: CreateServiceInput) => Promise<{
    category: {
        name: string;
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
    createdAt: Date;
    updatedAt: Date;
    technicianId: string;
    description: string | null;
    categoryId: string;
    title: string;
    price: number;
    durationMins: number;
}>;
export declare const updateSingleService: (serviceId: string, input: UpdateServiceInput) => Promise<{
    category: {
        name: string;
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
    createdAt: Date;
    updatedAt: Date;
    technicianId: string;
    description: string | null;
    categoryId: string;
    title: string;
    price: number;
    durationMins: number;
}>;
export declare const deleteSingleService: (serviceId: string) => Promise<void>;
//# sourceMappingURL=services.service.d.ts.map