import type { CreateCategoryInput, UpdateCategoryInput } from './categories.validation';

export interface ICategory {
  id: string;
  name: string;
  description: string | null;
  icon: string | null;
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
  createCategory(input: CreateCategoryInput): Promise<ICategory>;
  updateCategory(categoryId: string, input: UpdateCategoryInput): Promise<ICategory>;
  deleteCategory(categoryId: string): Promise<void>;
}

export interface ICategoryController {
  getCategories(req: Request, res: Response): Promise<void>;
  getCategory(req: Request, res: Response): Promise<void>;
  create(req: Request, res: Response): Promise<void>;
  update(req: Request, res: Response): Promise<void>;
  remove(req: Request, res: Response): Promise<void>;
}
