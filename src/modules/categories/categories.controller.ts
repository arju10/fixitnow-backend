import type { Request, Response } from 'express';
import { sendResponse } from '../../utils/ApiResponse';
import { catchAsync } from '../../utils/catchAsync';
import { ApiError } from '../../utils/ApiError';
import {
  getAllCategories,
  getSingleCategory,
  createNewCategory,
  updateSingleCategory,
  deleteSingleCategory,
} from './categories.service';
import type { CreateCategoryInput, UpdateCategoryInput } from './categories.validation';

export const getAllCategoriesController = catchAsync(async (req: Request, res: Response) => {
  const categories = await getAllCategories();
  sendResponse(res, 200, 'Categories fetched successfully', categories);
});

export const getSingleCategoryController = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id || typeof id !== 'string') {
    throw new ApiError(400, 'Invalid category ID');
  }
  const category = await getSingleCategory(id);
  sendResponse(res, 200, 'Category fetched successfully', category);
});

export const createCategoryController = catchAsync(async (req: Request, res: Response) => {
  const input = req.body as CreateCategoryInput;
  const category = await createNewCategory(input);
  sendResponse(res, 201, 'Category created successfully', category);
});

export const updateCategoryController = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id || typeof id !== 'string') {
    throw new ApiError(400, 'Invalid category ID');
  }
  const input = req.body as UpdateCategoryInput;
  const category = await updateSingleCategory(id, input);
  sendResponse(res, 200, 'Category updated successfully', category);
});

export const deleteCategoryController = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id || typeof id !== 'string') {
    throw new ApiError(400, 'Invalid category ID');
  }
  await deleteSingleCategory(id);
  sendResponse(res, 200, 'Category deleted successfully');
});
