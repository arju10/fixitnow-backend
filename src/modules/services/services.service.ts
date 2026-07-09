import { prisma } from '../../lib/prisma';
import { ApiError } from '../../utils/ApiError';
import type { CreateServiceInput, UpdateServiceInput } from './services.validation';

export const getAllServices = async (filters?: {
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
}) => {
  const where: any = {};

  if (filters?.categoryId) {
    where.categoryId = filters.categoryId;
  }

  if (filters?.minPrice !== undefined) {
    where.price = {
      ...where.price,
      gte: filters.minPrice,
    };
  }

  if (filters?.maxPrice !== undefined) {
    where.price = {
      ...where.price,
      lte: filters.maxPrice,
    };
  }

  return prisma.service.findMany({
    where,
    include: {
      category: {
        select: {
          id: true,
          name: true,
        },
      },
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
    orderBy: {
      createdAt: 'desc',
    },
  });
};

export const getSingleService = async (serviceId: string) => {
  const service = await prisma.service.findUnique({
    where: { id: serviceId },
    include: {
      category: {
        select: {
          id: true,
          name: true,
        },
      },
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
          availability: true,
          reviews: {
            include: {
              customer: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
            orderBy: {
              createdAt: 'desc',
            },
          },
        },
      },
    },
  });

  if (!service) {
    throw new ApiError(404, 'Service not found');
  }

  return service;
};

export const getServicesByTechnicianId = async (technicianId: string) => {
  return prisma.service.findMany({
    where: { technicianId },
    include: {
      category: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
};

export const createNewService = async (technicianId: string, input: CreateServiceInput) => {
  // Check if technician exists
  const technician = await prisma.technicianProfile.findUnique({
    where: { userId: technicianId },
  });

  if (!technician) {
    throw new ApiError(404, 'Technician profile not found');
  }

  // Check if category exists
  const category = await prisma.category.findUnique({
    where: { id: input.categoryId },
  });

  if (!category) {
    throw new ApiError(404, 'Category not found');
  }

  const data: any = {
    title: input.title,
    price: input.price,
    categoryId: input.categoryId,
    technicianId: technician.id,
  };

  if (input.description !== undefined) {
    data.description = input.description || null;
  }

  if (input.durationMins !== undefined) {
    data.durationMins = input.durationMins;
  }

  return prisma.service.create({
    data,
    include: {
      category: {
        select: {
          id: true,
          name: true,
        },
      },
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
  });
};

export const updateSingleService = async (serviceId: string, input: UpdateServiceInput) => {
  // Check if service exists
  await getSingleService(serviceId);

  // If categoryId is being updated, check if category exists
  if (input.categoryId) {
    const category = await prisma.category.findUnique({
      where: { id: input.categoryId },
    });

    if (!category) {
      throw new ApiError(404, 'Category not found');
    }
  }

  const data: any = {};
  if (input.title !== undefined) data.title = input.title;
  if (input.description !== undefined) data.description = input.description || null;
  if (input.price !== undefined) data.price = input.price;
  if (input.durationMins !== undefined) data.durationMins = input.durationMins;
  if (input.categoryId !== undefined) data.categoryId = input.categoryId;

  return prisma.service.update({
    where: { id: serviceId },
    data,
    include: {
      category: {
        select: {
          id: true,
          name: true,
        },
      },
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
  });
};

export const deleteSingleService = async (serviceId: string) => {
  // Check if service exists
  await getSingleService(serviceId);

  // Check if service has bookings
  const service = await prisma.service.findUnique({
    where: { id: serviceId },
    include: {
      bookings: {
        select: { id: true },
      },
    },
  });

  if (service && service.bookings.length > 0) {
    throw new ApiError(400, 'Cannot delete service with existing bookings.');
  }

  await prisma.service.delete({
    where: { id: serviceId },
  });
};
