export interface ICategory {
    id: string;
    name: string;
    description: string | null;
    createdAt: Date;
    updatedAt: Date;
}
export interface ICategoryWithServices extends ICategory {
    services: {
        id: string;
        title: string;
        price: number;
    }[];
}
export interface ICategoryService {
    getAllCategories(): Promise<ICategoryWithServices[]>;
    getCategoryById(categoryId: string): Promise<ICategoryWithServices>;
    createCategory(input: any): Promise<ICategory>;
    updateCategory(categoryId: string, input: any): Promise<ICategory>;
    deleteCategory(categoryId: string): Promise<void>;
}
//# sourceMappingURL=categories.interface.d.ts.map