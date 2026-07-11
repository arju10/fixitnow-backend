import type { CreateCategoryInput, UpdateCategoryInput } from './categories.validation';
export declare const getAllCategories: () => Promise<({
    services: {
        id: string;
        title: string;
        price: number;
    }[];
} & {
    name: string;
    id: string;
    createdAt: Date;
    updatedAt: Date;
    description: string | null;
})[]>;
export declare const getSingleCategory: (categoryId: string) => Promise<{
    services: ({
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
        isActive: boolean;
    })[];
} & {
    name: string;
    id: string;
    createdAt: Date;
    updatedAt: Date;
    description: string | null;
}>;
export declare const createNewCategory: (input: CreateCategoryInput) => Promise<{
    name: string;
    id: string;
    createdAt: Date;
    updatedAt: Date;
    description: string | null;
}>;
export declare const updateSingleCategory: (categoryId: string, input: UpdateCategoryInput) => Promise<{
    name: string;
    id: string;
    createdAt: Date;
    updatedAt: Date;
    description: string | null;
}>;
export declare const deleteSingleCategory: (categoryId: string) => Promise<void>;
//# sourceMappingURL=categories.service.d.ts.map