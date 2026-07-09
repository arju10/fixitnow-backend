import { prisma } from '../../lib/prisma';
import { ApiError } from '../../utils/ApiError';
import type { CreateCategoryInput, UpdateCategoryInput } from './categories.validation';

export const getAllCategories = async () => {
  return prisma.category.findMany({
    include: {
      services: {
        select: {
          id: true,
          title: true,
          price: true,
        },
      },
    },
    orderBy: {
      name: 'asc',
    },
  });
};

export const getSingleCategory = async (categoryId: string) => {
  const category = await prisma.category.findUnique({
    where: { id: categoryId },
    include: {
      services: {
        include: {
          technician: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  phone: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!category) {
    throw new ApiError(404, 'Category not found');
  }

  return category;
};

export const createNewCategory = async (input: CreateCategoryInput) => {
  const existingCategory = await prisma.category.findUnique({
    where: { name: input.name },
  });

  if (existingCategory) {
    throw new ApiError(409, 'Category with this name already exists');
  }

  const data: any = { name: input.name };
  if (input.description !== undefined) {
    data.description = input.description || null;
  }

  return prisma.category.create({ data });
};

export const updateSingleCategory = async (categoryId: string, input: UpdateCategoryInput) => {
  await getSingleCategory(categoryId);

  if (input.name) {
    const existingCategory = await prisma.category.findFirst({
      where: {
        name: input.name,
        id: { not: categoryId },
      },
    });

    if (existingCategory) {
      throw new ApiError(409, 'Category with this name already exists');
    }
  }

  const data: any = {};
  if (input.name !== undefined) data.name = input.name;
  if (input.description !== undefined) data.description = input.description || null;

  return prisma.category.update({
    where: { id: categoryId },
    data,
  });
};

export const deleteSingleCategory = async (categoryId: string) => {
  await getSingleCategory(categoryId);

  const category = await prisma.category.findUnique({
    where: { id: categoryId },
    include: {
      services: {
        select: { id: true },
      },
    },
  });

  if (category && category.services.length > 0) {
    throw new ApiError(
      400,
      'Cannot delete category with existing services. Delete services first.'
    );
  }

  await prisma.category.delete({
    where: { id: categoryId },
  });
};
