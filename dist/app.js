

   import { createRequire } from 'module';

   const require = createRequire(import.meta.url);

  

// src/app.ts
import cookieParser from "cookie-parser";
import cors from "cors";
import express2 from "express";

// src/config/index.ts
import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.join(process.cwd(), ".env") });
var config_default = {
  port: process.env.PORT,
  database_url: process.env.DATABASE_URL,
  app_url: process.env.APP_URL,
  cors_origin: process.env.CORS_ORIGIN,
  bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,
  jwt_access_secret: process.env.JWT_ACCESS_SECRET,
  jwt_refresh_secret: process.env.JWT_REFRESH_SECRET,
  jwt_access_expires_in: process.env.JWT_ACCESS_EXPIRES_IN,
  jwt_refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN,
  stripe_product_price_id: process.env.STRIPE_PRODUCT_PRICE_ID,
  stripe_secret_key: process.env.STRIPE_SECRET_KEY,
  stripe_publishable_key: process.env.STRIPE_PUBLISHABLE_KEY,
  stripe_webhook_secret: process.env.STRIPE_WEBHOOK_SECRET
};

// src/middleware/error.middleware.ts
import { ZodError } from "zod";
import { Prisma } from "@prisma/client";

// src/utils/ApiError.ts
var ApiError = class extends Error {
  statusCode;
  errorDetails;
  constructor(statusCode, message, errorDetails = null) {
    super(message);
    this.statusCode = statusCode;
    this.errorDetails = errorDetails;
    Error.captureStackTrace(this, this.constructor);
  }
};

// src/middleware/error.middleware.ts
var notFoundHandler = (req, _res, next) => {
  next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`));
};
var globalErrorHandler = (err, _req, res, _next) => {
  let statusCode = 500;
  let message = "Something went wrong";
  let errorDetails = null;
  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
    errorDetails = err.errorDetails;
  } else if (err instanceof ZodError) {
    statusCode = 400;
    message = "Validation failed";
    errorDetails = err.issues.map((issue) => ({
      path: issue.path.join("."),
      message: issue.message
    }));
  } else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    statusCode = 400;
    if (err.code === "P2002") {
      message = `Duplicate value for field(s): ${err.meta?.target?.join(", ")}`;
    } else if (err.code === "P2025") {
      statusCode = 404;
      message = "Record not found";
    } else {
      message = "Database request error";
    }
    errorDetails = process.env.NODE_ENV === "development" ? err.message : null;
  } else if (err instanceof Error) {
    message = err.message || message;
    errorDetails = process.env.NODE_ENV === "development" ? err.stack : null;
  }
  res.status(statusCode).json({
    success: false,
    message,
    errorDetails
  });
};

// src/utils/ApiResponse.ts
var sendResponse = (res, statusCode, message, data) => {
  res.status(statusCode).json({
    success: true,
    message,
    data: data ?? null
  });
};

// src/modules/auth/auth.route.ts
import { Router } from "express";

// src/utils/catchAsync.ts
var catchAsync = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// src/lib/prisma.ts
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import "dotenv/config";
var connectionString = `${process.env.DATABASE_URL}`;
var adapter = new PrismaPg({
  connectionString,
  max: 5
});
var prisma = new PrismaClient({ adapter });

// src/utils/hash.ts
import bcrypt from "bcryptjs";
var hashPassword = async (plain) => {
  const saltRounds = parseInt(config_default.bcrypt_salt_rounds) || 10;
  const salt = await bcrypt.genSalt(saltRounds);
  return bcrypt.hash(plain, salt);
};
var comparePassword = async (plain, hashed) => {
  return bcrypt.compare(plain, hashed);
};

// src/utils/jwt.ts
import jwt from "jsonwebtoken";
var signToken = (payload) => {
  return jwt.sign(payload, config_default.jwt_access_secret, {
    expiresIn: config_default.jwt_access_expires_in
  });
};
var verifyToken = (token) => {
  if (!token) {
    throw new Error("Token is required");
  }
  return jwt.verify(token, config_default.jwt_access_secret);
};

// src/modules/auth/auth.service.ts
import { Role } from "@prisma/client";
var registerUser = async (input) => {
  const { email, password, name, phone, role } = input;
  const existingUser = await prisma.user.findUnique({
    where: { email }
  });
  if (existingUser) {
    throw new ApiError(409, "User with this email already exists");
  }
  const hashedPassword = await hashPassword(password);
  const user = await prisma.$transaction(async (tx) => {
    const newUser = await tx.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        phone: phone || null,
        role
      }
    });
    if (role === Role.TECHNICIAN) {
      await tx.technicianProfile.create({
        data: {
          userId: newUser.id
        }
      });
    } else if (role === Role.CUSTOMER) {
      await tx.customerProfile.create({
        data: {
          userId: newUser.id
        }
      });
    } else if (role === Role.ADMIN) {
      await tx.adminProfile.create({
        data: {
          userId: newUser.id,
          isSuperAdmin: false
          // First admin can be promoted later
        }
      });
    }
    return newUser;
  });
  const token = signToken({
    userId: user.id,
    role: user.role
  });
  const { password: _, ...userWithoutPassword } = user;
  return {
    user: userWithoutPassword,
    token
  };
};
var loginUser = async (input) => {
  const { email, password } = input;
  const user = await prisma.user.findUnique({
    where: { email }
  });
  if (!user) {
    throw new ApiError(401, "Invalid credentials");
  }
  if (user.status === "BANNED") {
    throw new ApiError(403, "Account is banned. Please contact admin");
  }
  const isPasswordValid = await comparePassword(password, user.password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid credentials");
  }
  const token = signToken({
    userId: user.id,
    role: user.role
  });
  const { password: _, ...userWithoutPassword } = user;
  return {
    user: userWithoutPassword,
    token
  };
};
var getCurrentUser = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      technicianProfile: {
        include: {
          services: true,
          availability: true
        }
      },
      customerProfile: true,
      adminProfile: true
    }
  });
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

// src/modules/auth/auth.controller.ts
var register = catchAsync(async (req, res) => {
  const input = req.body;
  const result = await registerUser(input);
  sendResponse(res, 201, "User registered successfully", result);
});
var login = catchAsync(async (req, res) => {
  const input = req.body;
  const result = await loginUser(input);
  sendResponse(res, 200, "Login successful", result);
});
var getMe = catchAsync(async (req, res) => {
  if (!req.user) {
    throw new ApiError(401, "User not authenticated");
  }
  const user = await getCurrentUser(req.user.id);
  sendResponse(res, 200, "User fetched successfully", user);
});

// src/middleware/auth.middleware.ts
var protect = catchAsync(async (req, _res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new ApiError(401, "You are not logged in. Please provide a valid token.");
  }
  const token = authHeader.split(" ")[1];
  if (!token) {
    throw new ApiError(401, "Invalid token format.");
  }
  const decoded = verifyToken(token);
  const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
  if (!user) {
    throw new ApiError(401, "The user belonging to this token no longer exists.");
  }
  if (user.status === "BANNED") {
    throw new ApiError(403, "Your account has been banned. Contact support.");
  }
  req.user = { id: user.id, role: user.role, email: user.email };
  next();
});
var restrictTo = (...roles) => {
  return (req, _res, next) => {
    if (!req.user) {
      throw new ApiError(401, "You are not logged in.");
    }
    if (!roles.includes(req.user.role)) {
      throw new ApiError(403, "You do not have permission to perform this action.");
    }
    next();
  };
};

// src/middleware/validate.middleware.ts
import "zod";
var validate = (schema) => {
  return (req, _res, next) => {
    try {
      const parsed = schema.parse({
        body: req.body,
        query: req.query,
        params: req.params
      });
      req.body = parsed.body ?? req.body;
      next();
    } catch (err) {
      next(err);
    }
  };
};

// src/modules/auth/auth.validation.ts
import { z } from "zod";
import { Role as Role2 } from "@prisma/client";
var registerSchema = z.object({
  body: z.object({
    email: z.string().email("Invalid email format"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    name: z.string().min(2, "Name must be at least 2 characters"),
    phone: z.string().optional(),
    role: z.enum([Role2.CUSTOMER, Role2.TECHNICIAN, Role2.ADMIN])
  })
});
var loginSchema = z.object({
  body: z.object({
    email: z.string().email("Invalid email format"),
    password: z.string().min(1, "Password is required")
  })
});

// src/modules/auth/auth.route.ts
var router = Router();
router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.get("/me", protect, getMe);
var auth_route_default = router;

// src/modules/users/users.route.ts
import { Router as Router2 } from "express";

// src/modules/users/users.service.ts
var getAllUsers = async (filters) => {
  const where = {};
  if (filters?.role) {
    where.role = filters.role;
  }
  if (filters?.status) {
    where.status = filters.status;
  }
  return prisma.user.findMany({
    where,
    include: {
      technicianProfile: {
        include: {
          services: true,
          availability: true
        }
      }
    },
    orderBy: {
      createdAt: "desc"
    }
  });
};
var getUserById = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      technicianProfile: {
        include: {
          services: true,
          availability: true
        }
      }
    }
  });
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  return user;
};
var updateUser = async (userId, input) => {
  const updateData = {};
  if (input.name !== void 0) updateData.name = input.name;
  if (input.phone !== void 0) updateData.phone = input.phone || null;
  if (input.profileImage !== void 0) updateData.profileImage = input.profileImage;
  const user = await prisma.user.update({
    where: { id: userId },
    data: updateData
  });
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
};
var updateUserStatus = async (userId, status) => {
  const user = await prisma.user.update({
    where: { id: userId },
    data: { status }
  });
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
};
var deleteUser = async (userId) => {
  await prisma.user.delete({
    where: { id: userId }
  });
};
var getDashboardStats = async () => {
  const [totalUsers, totalTechnicians, totalCustomers, totalAdmins, bannedUsers] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { role: "TECHNICIAN" } }),
    prisma.user.count({ where: { role: "CUSTOMER" } }),
    prisma.user.count({ where: { role: "ADMIN" } }),
    prisma.user.count({ where: { status: "BANNED" } })
  ]);
  return {
    totalUsers,
    totalTechnicians,
    totalCustomers,
    totalAdmins,
    bannedUsers
  };
};

// src/modules/users/users.controller.ts
var getUsers = catchAsync(async (req, res) => {
  const { role, status } = req.query;
  const filters = {
    role,
    status
  };
  const users = await getAllUsers(filters);
  sendResponse(res, 200, "Users fetched successfully", users);
});
var getUser = catchAsync(async (req, res) => {
  const { id } = req.params;
  if (!id || typeof id !== "string") {
    throw new ApiError(400, "Invalid user ID");
  }
  const user = await getUserById(id);
  sendResponse(res, 200, "User fetched successfully", user);
});
var updateUserProfile = catchAsync(async (req, res) => {
  const userId = req.params.id || req.user?.id;
  if (!userId) {
    throw new ApiError(400, "User ID is required");
  }
  if (typeof userId !== "string") {
    throw new ApiError(400, "Invalid user ID");
  }
  if (req.user?.role !== "ADMIN" && req.user?.id !== userId) {
    throw new ApiError(403, "You can only update your own profile");
  }
  const input = req.body;
  const user = await updateUser(userId, input);
  sendResponse(res, 200, "User updated successfully", user);
});
var updateStatus = catchAsync(async (req, res) => {
  const { id } = req.params;
  if (!id || typeof id !== "string") {
    throw new ApiError(400, "Invalid user ID");
  }
  const { status } = req.body;
  const user = await updateUserStatus(id, status);
  sendResponse(res, 200, `User status updated to ${status} successfully`, user);
});
var deleteUserProfile = catchAsync(async (req, res) => {
  const { id } = req.params;
  if (!id || typeof id !== "string") {
    throw new ApiError(400, "Invalid user ID");
  }
  await deleteUser(id);
  sendResponse(res, 200, "User deleted successfully");
});
var getStats = catchAsync(async (req, res) => {
  const stats = await getDashboardStats();
  sendResponse(res, 200, "Dashboard stats fetched successfully", stats);
});

// src/middleware/role.middleware.ts
var restrictTo2 = (...roles) => {
  return (req, _res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new ApiError(403, "You do not have permission to perform this action."));
    }
    next();
  };
};

// src/modules/users/users.validation.ts
import { z as z2 } from "zod";
var updateUserSchema = z2.object({
  body: z2.object({
    name: z2.string().min(2, "Name must be at least 2 characters").optional(),
    phone: z2.string().optional(),
    profileImage: z2.string().url("Invalid URL").optional()
  })
});
var updateUserStatusSchema = z2.object({
  body: z2.object({
    status: z2.enum(["ACTIVE", "BANNED"])
  })
});

// src/modules/users/users.route.ts
var router2 = Router2();
router2.use(protect);
router2.get("/", restrictTo2("ADMIN"), getUsers);
router2.get("/stats", restrictTo2("ADMIN"), getStats);
router2.patch("/:id/status", restrictTo2("ADMIN"), validate(updateUserStatusSchema), updateStatus);
router2.get("/:id", getUser);
router2.put("/:id", validate(updateUserSchema), updateUserProfile);
router2.delete("/:id", deleteUserProfile);
var users_route_default = router2;

// src/modules/admin/admin.route.ts
import { Router as Router3 } from "express";

// src/modules/admin/admin.controller.ts
var getAllUsers2 = catchAsync(async (req, res) => {
  const { role, status } = req.query;
  const where = {};
  if (role) where.role = role;
  if (status) where.status = status;
  const users = await prisma.user.findMany({
    where,
    include: {
      technicianProfile: {
        include: {
          services: true,
          availability: true
        }
      },
      bookings: {
        where: {
          status: {
            notIn: ["CANCELLED", "DECLINED"]
          }
        },
        select: {
          id: true,
          status: true,
          totalAmount: true,
          scheduledAt: true
        }
      }
    },
    orderBy: {
      createdAt: "desc"
    }
  });
  sendResponse(res, 200, "Users fetched successfully", users);
});
var getAllBookings = catchAsync(async (req, res) => {
  const { status, fromDate, toDate } = req.query;
  const where = {};
  if (status) where.status = status;
  if (fromDate) {
    where.scheduledAt = {
      gte: new Date(fromDate)
    };
  }
  if (toDate) {
    where.scheduledAt = {
      ...where.scheduledAt,
      lte: new Date(toDate)
    };
  }
  const bookings = await prisma.booking.findMany({
    where,
    include: {
      customer: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true
        }
      },
      technician: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true
            }
          }
        }
      },
      service: {
        include: {
          category: true
        }
      },
      payment: true,
      review: true
    },
    orderBy: {
      createdAt: "desc"
    }
  });
  sendResponse(res, 200, "Bookings fetched successfully", bookings);
});
var getDashboardStats2 = catchAsync(async (req, res) => {
  const [
    totalUsers,
    totalTechnicians,
    totalCustomers,
    totalAdmins,
    totalBookings,
    completedBookings,
    totalRevenue
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { role: "TECHNICIAN" } }),
    prisma.user.count({ where: { role: "CUSTOMER" } }),
    prisma.user.count({ where: { role: "ADMIN" } }),
    prisma.booking.count(),
    prisma.booking.count({ where: { status: "COMPLETED" } }),
    prisma.payment.aggregate({
      where: { status: "COMPLETED" },
      _sum: {
        amount: true
      }
    })
  ]);
  const recentBookings = await prisma.booking.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    include: {
      customer: {
        select: {
          name: true,
          email: true
        }
      },
      service: {
        select: {
          title: true
        }
      }
    }
  });
  sendResponse(res, 200, "Dashboard stats fetched successfully", {
    totalUsers,
    totalTechnicians,
    totalCustomers,
    totalAdmins,
    totalBookings,
    completedBookings,
    totalRevenue: totalRevenue._sum.amount || 0,
    recentBookings
  });
});

// src/modules/admin/admin.route.ts
var router3 = Router3();
router3.use(protect, restrictTo2("ADMIN"));
router3.get("/users", getAllUsers2);
router3.get("/bookings", getAllBookings);
router3.get("/stats", getDashboardStats2);
var admin_route_default = router3;

// src/modules/admin-profile/admin-profile.route.ts
import { Router as Router4 } from "express";

// src/modules/admin-profile/admin-profile.service.ts
var getAdminProfile = async (userId) => {
  const admin = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      adminProfile: true
    }
  });
  if (!admin) {
    throw new ApiError(404, "Admin not found");
  }
  if (admin.role !== "ADMIN") {
    throw new ApiError(400, "User is not an admin");
  }
  return admin;
};
var updateAdminProfile = async (userId, input) => {
  const admin = await prisma.user.findUnique({
    where: { id: userId },
    include: { adminProfile: true }
  });
  if (!admin) {
    throw new ApiError(404, "Admin not found");
  }
  if (admin.role !== "ADMIN") {
    throw new ApiError(400, "User is not an admin");
  }
  const userData = {};
  if (input.name !== void 0) userData.name = input.name;
  if (input.phone !== void 0) userData.phone = input.phone || null;
  const profileData = {};
  if (input.department !== void 0) profileData.department = input.department || null;
  if (input.position !== void 0) profileData.position = input.position || null;
  if (input.permissions !== void 0) profileData.permissions = input.permissions;
  if (input.isSuperAdmin !== void 0) profileData.isSuperAdmin = input.isSuperAdmin;
  await prisma.$transaction(async (tx) => {
    await tx.user.update({
      where: { id: userId },
      data: userData
    });
    await tx.adminProfile.upsert({
      where: { userId },
      update: profileData,
      create: {
        userId,
        ...profileData
      }
    });
  });
  return getAdminProfile(userId);
};

// src/modules/admin-profile/admin-profile.controller.ts
var getMyAdminProfileController = catchAsync(async (req, res) => {
  if (!req.user) {
    throw new ApiError(401, "User not authenticated");
  }
  if (req.user.role !== "ADMIN") {
    throw new ApiError(403, "Access denied. Admin only.");
  }
  const profile = await getAdminProfile(req.user.id);
  sendResponse(res, 200, "Admin profile fetched successfully", profile);
});
var updateMyAdminProfileController = catchAsync(async (req, res) => {
  if (!req.user) {
    throw new ApiError(401, "User not authenticated");
  }
  if (req.user.role !== "ADMIN") {
    throw new ApiError(403, "Access denied. Admin only.");
  }
  const input = req.body;
  const profile = await updateAdminProfile(req.user.id, input);
  sendResponse(res, 200, "Admin profile updated successfully", profile);
});

// src/modules/admin-profile/admin-profile.validation.ts
import { z as z3 } from "zod";
var updateAdminProfileSchema = z3.object({
  body: z3.object({
    name: z3.string().min(2, "Name must be at least 2 characters").optional(),
    phone: z3.string().optional(),
    department: z3.string().optional(),
    position: z3.string().optional(),
    permissions: z3.array(z3.string()).optional(),
    isSuperAdmin: z3.boolean().optional()
  })
});

// src/modules/admin-profile/admin-profile.route.ts
var router4 = Router4();
router4.use(protect, restrictTo("ADMIN"));
router4.get("/profile", getMyAdminProfileController);
router4.put("/profile", validate(updateAdminProfileSchema), updateMyAdminProfileController);
var admin_profile_route_default = router4;

// src/modules/categories/categories.route.ts
import { Router as Router5 } from "express";

// src/modules/categories/categories.service.ts
var getAllCategories = async () => {
  return prisma.category.findMany({
    include: {
      services: {
        select: {
          id: true,
          title: true,
          price: true
        }
      }
    },
    orderBy: {
      name: "asc"
    }
  });
};
var getSingleCategory = async (categoryId) => {
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
                  phone: true
                }
              }
            }
          }
        }
      }
    }
  });
  if (!category) {
    throw new ApiError(404, "Category not found");
  }
  return category;
};
var createNewCategory = async (input) => {
  const existingCategory = await prisma.category.findUnique({
    where: { name: input.name }
  });
  if (existingCategory) {
    throw new ApiError(409, "Category with this name already exists");
  }
  const data = { name: input.name };
  if (input.description !== void 0) {
    data.description = input.description || null;
  }
  return prisma.category.create({ data });
};
var updateSingleCategory = async (categoryId, input) => {
  await getSingleCategory(categoryId);
  if (input.name) {
    const existingCategory = await prisma.category.findFirst({
      where: {
        name: input.name,
        id: { not: categoryId }
      }
    });
    if (existingCategory) {
      throw new ApiError(409, "Category with this name already exists");
    }
  }
  const data = {};
  if (input.name !== void 0) data.name = input.name;
  if (input.description !== void 0) data.description = input.description || null;
  return prisma.category.update({
    where: { id: categoryId },
    data
  });
};
var deleteSingleCategory = async (categoryId) => {
  await getSingleCategory(categoryId);
  const category = await prisma.category.findUnique({
    where: { id: categoryId },
    include: {
      services: {
        select: { id: true }
      }
    }
  });
  if (category && category.services.length > 0) {
    throw new ApiError(
      400,
      "Cannot delete category with existing services. Delete services first."
    );
  }
  await prisma.category.delete({
    where: { id: categoryId }
  });
};

// src/modules/categories/categories.controller.ts
var getAllCategoriesController = catchAsync(async (req, res) => {
  const categories = await getAllCategories();
  sendResponse(res, 200, "Categories fetched successfully", categories);
});
var getSingleCategoryController = catchAsync(async (req, res) => {
  const { id } = req.params;
  if (!id || typeof id !== "string") {
    throw new ApiError(400, "Invalid category ID");
  }
  const category = await getSingleCategory(id);
  sendResponse(res, 200, "Category fetched successfully", category);
});
var createCategoryController = catchAsync(async (req, res) => {
  const input = req.body;
  const category = await createNewCategory(input);
  sendResponse(res, 201, "Category created successfully", category);
});
var updateCategoryController = catchAsync(async (req, res) => {
  const { id } = req.params;
  if (!id || typeof id !== "string") {
    throw new ApiError(400, "Invalid category ID");
  }
  const input = req.body;
  const category = await updateSingleCategory(id, input);
  sendResponse(res, 200, "Category updated successfully", category);
});
var deleteCategoryController = catchAsync(async (req, res) => {
  const { id } = req.params;
  if (!id || typeof id !== "string") {
    throw new ApiError(400, "Invalid category ID");
  }
  await deleteSingleCategory(id);
  sendResponse(res, 200, "Category deleted successfully");
});

// src/modules/categories/categories.validation.ts
import { z as z4 } from "zod";
var createCategorySchema = z4.object({
  body: z4.object({
    name: z4.string().min(2, "Category name must be at least 2 characters"),
    description: z4.string().optional()
  })
});
var updateCategorySchema = z4.object({
  body: z4.object({
    name: z4.string().min(2, "Category name must be at least 2 characters").optional(),
    description: z4.string().optional()
  })
});

// src/modules/categories/categories.route.ts
var router5 = Router5();
router5.get("/", getAllCategoriesController);
router5.get("/:id", getSingleCategoryController);
router5.post(
  "/",
  protect,
  restrictTo("ADMIN"),
  validate(createCategorySchema),
  createCategoryController
);
router5.put(
  "/:id",
  protect,
  restrictTo("ADMIN"),
  validate(updateCategorySchema),
  updateCategoryController
);
router5.delete("/:id", protect, restrictTo("ADMIN"), deleteCategoryController);
var categories_route_default = router5;

// src/modules/services/services.route.ts
import { Router as Router6 } from "express";

// src/modules/services/services.service.ts
var getAllServices = async (filters) => {
  const where = {};
  if (filters?.categoryId) {
    where.categoryId = filters.categoryId;
  }
  if (filters?.minPrice !== void 0) {
    where.price = {
      ...where.price,
      gte: filters.minPrice
    };
  }
  if (filters?.maxPrice !== void 0) {
    where.price = {
      ...where.price,
      lte: filters.maxPrice
    };
  }
  return prisma.service.findMany({
    where,
    include: {
      category: {
        select: {
          id: true,
          name: true
        }
      },
      technician: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true
            }
          }
        }
      }
    },
    orderBy: {
      createdAt: "desc"
    }
  });
};
var getSingleService = async (serviceId) => {
  const service = await prisma.service.findUnique({
    where: { id: serviceId },
    include: {
      category: {
        select: {
          id: true,
          name: true
        }
      },
      technician: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true
            }
          },
          availability: true,
          reviews: {
            include: {
              customer: {
                select: {
                  id: true,
                  name: true
                }
              }
            },
            orderBy: {
              createdAt: "desc"
            }
          }
        }
      }
    }
  });
  if (!service) {
    throw new ApiError(404, "Service not found");
  }
  return service;
};
var getServicesByTechnicianId = async (technicianId) => {
  return prisma.service.findMany({
    where: { technicianId },
    include: {
      category: {
        select: {
          id: true,
          name: true
        }
      }
    },
    orderBy: {
      createdAt: "desc"
    }
  });
};
var createNewService = async (technicianId, input) => {
  const technician = await prisma.technicianProfile.findUnique({
    where: { userId: technicianId }
  });
  if (!technician) {
    throw new ApiError(404, "Technician profile not found");
  }
  const category = await prisma.category.findUnique({
    where: { id: input.categoryId }
  });
  if (!category) {
    throw new ApiError(404, "Category not found");
  }
  const data = {
    title: input.title,
    price: input.price,
    categoryId: input.categoryId,
    technicianId: technician.id
  };
  if (input.description !== void 0) {
    data.description = input.description || null;
  }
  if (input.durationMins !== void 0) {
    data.durationMins = input.durationMins;
  }
  return prisma.service.create({
    data,
    include: {
      category: {
        select: {
          id: true,
          name: true
        }
      },
      technician: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true
            }
          }
        }
      }
    }
  });
};
var updateSingleService = async (serviceId, input) => {
  await getSingleService(serviceId);
  if (input.categoryId) {
    const category = await prisma.category.findUnique({
      where: { id: input.categoryId }
    });
    if (!category) {
      throw new ApiError(404, "Category not found");
    }
  }
  const data = {};
  if (input.title !== void 0) data.title = input.title;
  if (input.description !== void 0) data.description = input.description || null;
  if (input.price !== void 0) data.price = input.price;
  if (input.durationMins !== void 0) data.durationMins = input.durationMins;
  if (input.categoryId !== void 0) data.categoryId = input.categoryId;
  return prisma.service.update({
    where: { id: serviceId },
    data,
    include: {
      category: {
        select: {
          id: true,
          name: true
        }
      },
      technician: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true
            }
          }
        }
      }
    }
  });
};
var deleteSingleService = async (serviceId) => {
  await getSingleService(serviceId);
  const service = await prisma.service.findUnique({
    where: { id: serviceId },
    include: {
      bookings: {
        select: { id: true }
      }
    }
  });
  if (service && service.bookings.length > 0) {
    throw new ApiError(400, "Cannot delete service with existing bookings.");
  }
  await prisma.service.delete({
    where: { id: serviceId }
  });
};

// src/modules/services/services.controller.ts
var getAllServicesController = catchAsync(async (req, res) => {
  const { categoryId, minPrice, maxPrice, minRating } = req.query;
  const filters = {};
  if (categoryId) {
    filters.categoryId = categoryId;
  }
  if (minPrice) {
    const price = parseFloat(minPrice);
    if (!isNaN(price)) {
      filters.minPrice = price;
    }
  }
  if (maxPrice) {
    const price = parseFloat(maxPrice);
    if (!isNaN(price)) {
      filters.maxPrice = price;
    }
  }
  if (minRating) {
    const rating = parseFloat(minRating);
    if (!isNaN(rating)) {
      filters.minRating = rating;
    }
  }
  const services = await getAllServices(filters);
  sendResponse(res, 200, "Services fetched successfully", services);
});
var getSingleServiceController = catchAsync(async (req, res) => {
  const { id } = req.params;
  if (!id || typeof id !== "string") {
    throw new ApiError(400, "Invalid service ID");
  }
  const service = await getSingleService(id);
  sendResponse(res, 200, "Service fetched successfully", service);
});
var getMyServicesController = catchAsync(async (req, res) => {
  if (!req.user) {
    throw new ApiError(401, "User not authenticated");
  }
  const technician = await prisma.technicianProfile.findUnique({
    where: { userId: req.user.id }
  });
  if (!technician) {
    throw new ApiError(404, "Technician profile not found");
  }
  const services = await getServicesByTechnicianId(technician.id);
  sendResponse(res, 200, "Services fetched successfully", services);
});
var createServiceController = catchAsync(async (req, res) => {
  if (!req.user) {
    throw new ApiError(401, "User not authenticated");
  }
  const input = req.body;
  const service = await createNewService(req.user.id, input);
  sendResponse(res, 201, "Service created successfully", service);
});
var updateServiceController = catchAsync(async (req, res) => {
  const { id } = req.params;
  if (!id || typeof id !== "string") {
    throw new ApiError(400, "Invalid service ID");
  }
  const service = await prisma.service.findUnique({
    where: { id },
    include: {
      technician: true
    }
  });
  if (!service) {
    throw new ApiError(404, "Service not found");
  }
  if (req.user?.role !== "ADMIN" && service.technician.userId !== req.user?.id) {
    throw new ApiError(403, "You can only update your own services");
  }
  const input = req.body;
  const updatedService = await updateSingleService(id, input);
  sendResponse(res, 200, "Service updated successfully", updatedService);
});
var deleteServiceController = catchAsync(async (req, res) => {
  const { id } = req.params;
  if (!id || typeof id !== "string") {
    throw new ApiError(400, "Invalid service ID");
  }
  const service = await prisma.service.findUnique({
    where: { id },
    include: {
      technician: true
    }
  });
  if (!service) {
    throw new ApiError(404, "Service not found");
  }
  if (req.user?.role !== "ADMIN" && service.technician.userId !== req.user?.id) {
    throw new ApiError(403, "You can only delete your own services");
  }
  await deleteSingleService(id);
  sendResponse(res, 200, "Service deleted successfully");
});

// src/modules/services/services.validation.ts
import { z as z5 } from "zod";
var createServiceSchema = z5.object({
  body: z5.object({
    title: z5.string().min(3, "Title must be at least 3 characters"),
    description: z5.string().optional(),
    price: z5.number().positive("Price must be positive"),
    durationMins: z5.number().positive("Duration must be positive").optional(),
    categoryId: z5.string().min(1, "Category ID is required")
  })
});
var updateServiceSchema = z5.object({
  body: z5.object({
    title: z5.string().min(3, "Title must be at least 3 characters").optional(),
    description: z5.string().optional(),
    price: z5.number().positive("Price must be positive").optional(),
    durationMins: z5.number().positive("Duration must be positive").optional(),
    categoryId: z5.string().optional(),
    isActive: z5.boolean().optional()
    // 👈 Add this
  })
});

// src/modules/services/services.route.ts
var router6 = Router6();
router6.get("/", getAllServicesController);
router6.get("/:id", getSingleServiceController);
router6.use(protect);
router6.get("/my", restrictTo("TECHNICIAN"), getMyServicesController);
router6.post("/", restrictTo("TECHNICIAN"), validate(createServiceSchema), createServiceController);
router6.put("/:id", validate(updateServiceSchema), updateServiceController);
router6.delete("/:id", deleteServiceController);
var services_route_default = router6;

// src/modules/technicians/technicians.route.ts
import { Router as Router7 } from "express";

// src/modules/technicians/technicians.service.ts
var getTechnicianProfile = async (userId) => {
  const profile = await prisma.technicianProfile.findUnique({
    where: { userId },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          profileImage: true
        }
      },
      services: {
        include: {
          category: true
        }
      },
      availability: true,
      reviews: {
        include: {
          customer: {
            select: {
              id: true,
              name: true,
              profileImage: true
            }
          }
        },
        orderBy: {
          createdAt: "desc"
        }
      }
    }
  });
  if (!profile) {
    throw new ApiError(404, "Technician profile not found");
  }
  return profile;
};
var getAllTechnicians = async (filters) => {
  const where = {};
  if (filters?.location) {
    where.location = {
      contains: filters.location,
      mode: "insensitive"
    };
  }
  return prisma.technicianProfile.findMany({
    where,
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          profileImage: true
        }
      },
      services: {
        include: {
          category: true
        }
      },
      reviews: {
        select: {
          rating: true
        }
      }
    }
  });
};
var updateTechnicianProfile = async (userId, input) => {
  const data = {};
  if (input.bio !== void 0) {
    data.bio = input.bio || null;
  }
  if (input.experienceYrs !== void 0) {
    data.experienceYrs = input.experienceYrs;
  }
  if (input.location !== void 0) {
    data.location = input.location || null;
  }
  const profile = await prisma.technicianProfile.update({
    where: { userId },
    data,
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          profileImage: true
        }
      },
      services: true,
      availability: true
    }
  });
  return profile;
};
var addAvailabilitySlot = async (userId, input) => {
  const profile = await prisma.technicianProfile.findUnique({
    where: { userId }
  });
  if (!profile) {
    throw new ApiError(404, "Technician profile not found");
  }
  return prisma.availabilitySlot.create({
    data: {
      dayOfWeek: input.dayOfWeek,
      startTime: input.startTime,
      endTime: input.endTime,
      isActive: input.isActive ?? true,
      technicianId: profile.id
    }
  });
};
var getAvailabilitySlots = async (userId) => {
  const profile = await prisma.technicianProfile.findUnique({
    where: { userId }
  });
  if (!profile) {
    throw new ApiError(404, "Technician profile not found");
  }
  return prisma.availabilitySlot.findMany({
    where: { technicianId: profile.id },
    orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }]
  });
};
var removeAvailabilitySlot = async (slotId, userId) => {
  const slot = await prisma.availabilitySlot.findUnique({
    where: { id: slotId },
    include: {
      technician: true
    }
  });
  if (!slot) {
    throw new ApiError(404, "Availability slot not found");
  }
  if (slot.technician.userId !== userId) {
    throw new ApiError(403, "You can only delete your own availability slots");
  }
  await prisma.availabilitySlot.delete({
    where: { id: slotId }
  });
};

// src/modules/technicians/technicians.controller.ts
var getMyProfileController = catchAsync(async (req, res) => {
  if (!req.user) {
    throw new ApiError(401, "User not authenticated");
  }
  const profile = await getTechnicianProfile(req.user.id);
  sendResponse(res, 200, "Technician profile fetched successfully", profile);
});
var getAllTechniciansController = catchAsync(async (req, res) => {
  const { location } = req.query;
  const filters = {
    location
  };
  const technicians = await getAllTechnicians(filters);
  sendResponse(res, 200, "Technicians fetched successfully", technicians);
});
var getTechnicianByIdController = catchAsync(async (req, res) => {
  const { id } = req.params;
  if (!id || typeof id !== "string") {
    throw new ApiError(400, "Invalid technician ID");
  }
  const profile = await getTechnicianProfile(id);
  sendResponse(res, 200, "Technician profile fetched successfully", profile);
});
var updateMyProfileController = catchAsync(async (req, res) => {
  if (!req.user) {
    throw new ApiError(401, "User not authenticated");
  }
  const input = req.body;
  const profile = await updateTechnicianProfile(req.user.id, input);
  sendResponse(res, 200, "Technician profile updated successfully", profile);
});
var addAvailabilitySlotController = catchAsync(async (req, res) => {
  if (!req.user) {
    throw new ApiError(401, "User not authenticated");
  }
  const input = req.body;
  const slot = await addAvailabilitySlot(req.user.id, input);
  sendResponse(res, 201, "Availability slot added successfully", slot);
});
var getMyAvailabilitySlotsController = catchAsync(async (req, res) => {
  if (!req.user) {
    throw new ApiError(401, "User not authenticated");
  }
  const slots = await getAvailabilitySlots(req.user.id);
  sendResponse(res, 200, "Availability slots fetched successfully", slots);
});
var removeAvailabilitySlotController = catchAsync(async (req, res) => {
  if (!req.user) {
    throw new ApiError(401, "User not authenticated");
  }
  const { id } = req.params;
  if (!id || typeof id !== "string") {
    throw new ApiError(400, "Invalid slot ID");
  }
  await removeAvailabilitySlot(id, req.user.id);
  sendResponse(res, 200, "Availability slot removed successfully");
});

// src/modules/technicians/technicians.validation.ts
import { z as z6 } from "zod";
var updateTechnicianProfileSchema = z6.object({
  body: z6.object({
    bio: z6.string().optional(),
    experienceYrs: z6.number().min(0).optional(),
    location: z6.string().optional()
  })
});
var createAvailabilitySlotSchema = z6.object({
  body: z6.object({
    dayOfWeek: z6.number().min(0).max(6),
    startTime: z6.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
    endTime: z6.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
    isActive: z6.boolean().default(true)
  })
});

// src/modules/technicians/technicians.route.ts
var router7 = Router7();
router7.get("/", getAllTechniciansController);
router7.get("/:id", getTechnicianByIdController);
router7.use(protect);
router7.get("/profile", restrictTo("TECHNICIAN"), getMyProfileController);
router7.put(
  "/profile",
  restrictTo("TECHNICIAN"),
  validate(updateTechnicianProfileSchema),
  updateMyProfileController
);
router7.post(
  "/availability",
  restrictTo("TECHNICIAN"),
  validate(createAvailabilitySlotSchema),
  addAvailabilitySlotController
);
router7.get("/availability", restrictTo("TECHNICIAN"), getMyAvailabilitySlotsController);
router7.delete("/availability/:id", restrictTo("TECHNICIAN"), removeAvailabilitySlotController);
var technicians_route_default = router7;

// src/modules/bookings/bookings.route.ts
import { Router as Router8 } from "express";

// src/modules/bookings/bookings.service.ts
var createBooking = async (customerId, input) => {
  const { serviceId, scheduledAt, notes } = input;
  const service = await prisma.service.findUnique({
    where: { id: serviceId },
    include: {
      technician: true
    }
  });
  if (!service) {
    throw new ApiError(404, "Service not found");
  }
  if (service.isActive === false) {
    throw new ApiError(400, "Service is currently not available");
  }
  const existingBooking = await prisma.booking.findFirst({
    where: {
      technicianId: service.technicianId,
      scheduledAt,
      status: {
        notIn: ["CANCELLED", "DECLINED", "COMPLETED"]
      }
    }
  });
  if (existingBooking) {
    throw new ApiError(409, "Technician is not available at this time");
  }
  return prisma.booking.create({
    data: {
      customerId,
      technicianId: service.technicianId,
      serviceId,
      scheduledAt,
      totalAmount: service.price,
      notes: notes || null
    },
    include: {
      customer: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true
        }
      },
      technician: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true
            }
          }
        }
      },
      service: {
        include: {
          category: {
            select: {
              id: true,
              name: true
            }
          }
        }
      }
    }
  });
};
var getBookings = async (userId, role) => {
  const where = {};
  if (role === "CUSTOMER") {
    where.customerId = userId;
  } else if (role === "TECHNICIAN") {
    const profile = await prisma.technicianProfile.findUnique({
      where: { userId }
    });
    if (profile) {
      where.technicianId = profile.id;
    } else {
      throw new ApiError(404, "Technician profile not found");
    }
  } else if (role === "ADMIN") {
  }
  return prisma.booking.findMany({
    where,
    include: {
      customer: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true
        }
      },
      technician: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true
            }
          }
        }
      },
      service: {
        include: {
          category: {
            select: {
              id: true,
              name: true
            }
          }
        }
      },
      payment: true,
      review: true
    },
    orderBy: {
      createdAt: "desc"
    }
  });
};
var getBookingById = async (bookingId, userId, role) => {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: {
      customer: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true
        }
      },
      technician: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true
            }
          }
        }
      },
      service: {
        include: {
          category: {
            select: {
              id: true,
              name: true
            }
          }
        }
      },
      payment: true,
      review: true
    }
  });
  if (!booking) {
    throw new ApiError(404, "Booking not found");
  }
  const technicianProfile = await prisma.technicianProfile.findUnique({
    where: { userId }
  });
  const isCustomer = booking.customerId === userId;
  const isTechnician = technicianProfile && booking.technicianId === technicianProfile.id;
  const isAdmin = role === "ADMIN";
  if (!isCustomer && !isTechnician && !isAdmin) {
    throw new ApiError(403, "You can only view your own bookings");
  }
  return booking;
};
var updateBookingStatus = async (bookingId, status, userId, role) => {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: {
      technician: true
    }
  });
  if (!booking) {
    throw new ApiError(404, "Booking not found");
  }
  const technicianProfile = await prisma.technicianProfile.findUnique({
    where: { userId }
  });
  const isTechnician = technicianProfile && booking.technicianId === technicianProfile.id;
  const isAdmin = role === "ADMIN";
  if (!isTechnician && !isAdmin) {
    throw new ApiError(403, "Only technicians and admins can update booking status");
  }
  const validTransitions = {
    REQUESTED: ["ACCEPTED", "DECLINED", "CANCELLED"],
    ACCEPTED: ["PAID", "CANCELLED"],
    PAID: ["IN_PROGRESS", "CANCELLED"],
    IN_PROGRESS: ["COMPLETED", "CANCELLED"],
    COMPLETED: [],
    DECLINED: [],
    CANCELLED: []
  };
  if (!validTransitions[booking.status]?.includes(status)) {
    throw new ApiError(400, `Invalid status transition from ${booking.status} to ${status}`);
  }
  return prisma.booking.update({
    where: { id: bookingId },
    data: { status },
    include: {
      customer: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true
        }
      },
      technician: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true
            }
          }
        }
      },
      service: {
        include: {
          category: {
            select: {
              id: true,
              name: true
            }
          }
        }
      },
      payment: true,
      review: true
    }
  });
};
var cancelBooking = async (bookingId, userId) => {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId }
  });
  if (!booking) {
    throw new ApiError(404, "Booking not found");
  }
  if (booking.customerId !== userId) {
    throw new ApiError(403, "You can only cancel your own bookings");
  }
  if (booking.status === "IN_PROGRESS" || booking.status === "COMPLETED") {
    throw new ApiError(400, "Cannot cancel booking that is in progress or completed");
  }
  return prisma.booking.update({
    where: { id: bookingId },
    data: { status: "CANCELLED" },
    include: {
      customer: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true
        }
      },
      technician: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true
            }
          }
        }
      },
      service: {
        include: {
          category: {
            select: {
              id: true,
              name: true
            }
          }
        }
      }
    }
  });
};

// src/modules/bookings/bookings.controller.ts
var createBookingController = catchAsync(async (req, res) => {
  if (!req.user) {
    throw new ApiError(401, "User not authenticated");
  }
  const input = req.body;
  const booking = await createBooking(req.user.id, input);
  sendResponse(res, 201, "Booking created successfully", booking);
});
var getMyBookingsController = catchAsync(async (req, res) => {
  if (!req.user) {
    throw new ApiError(401, "User not authenticated");
  }
  const bookings = await getBookings(req.user.id, req.user.role);
  sendResponse(res, 200, "Bookings fetched successfully", bookings);
});
var getBookingController = catchAsync(async (req, res) => {
  if (!req.user) {
    throw new ApiError(401, "User not authenticated");
  }
  const { id } = req.params;
  if (!id || typeof id !== "string") {
    throw new ApiError(400, "Invalid booking ID");
  }
  const booking = await getBookingById(id, req.user.id, req.user.role);
  sendResponse(res, 200, "Booking fetched successfully", booking);
});
var updateBookingStatusController = catchAsync(async (req, res) => {
  if (!req.user) {
    throw new ApiError(401, "User not authenticated");
  }
  const { id } = req.params;
  if (!id || typeof id !== "string") {
    throw new ApiError(400, "Invalid booking ID");
  }
  const { status } = req.body;
  const booking = await updateBookingStatus(id, status, req.user.id, req.user.role);
  sendResponse(res, 200, "Booking status updated successfully", booking);
});
var cancelBookingController = catchAsync(async (req, res) => {
  if (!req.user) {
    throw new ApiError(401, "User not authenticated");
  }
  const { id } = req.params;
  if (!id || typeof id !== "string") {
    throw new ApiError(400, "Invalid booking ID");
  }
  const booking = await cancelBooking(id, req.user.id);
  sendResponse(res, 200, "Booking cancelled successfully", booking);
});

// src/modules/bookings/bookings.validation.ts
import { z as z7 } from "zod";
var createBookingSchema = z7.object({
  body: z7.object({
    serviceId: z7.string().min(1, "Service ID is required"),
    scheduledAt: z7.string().datetime({ message: "Invalid date format" }),
    notes: z7.string().optional()
  })
});
var updateBookingStatusSchema = z7.object({
  body: z7.object({
    status: z7.enum(["ACCEPTED", "DECLINED", "IN_PROGRESS", "COMPLETED", "CANCELLED"])
  })
});

// src/modules/bookings/bookings.route.ts
var router8 = Router8();
router8.use(protect);
router8.post("/", validate(createBookingSchema), createBookingController);
router8.get("/", getMyBookingsController);
router8.get("/:id", getBookingController);
router8.patch("/:id/cancel", cancelBookingController);
router8.patch("/:id/status", validate(updateBookingStatusSchema), updateBookingStatusController);
var bookings_route_default = router8;

// src/modules/customer/customer.route.ts
import { Router as Router9 } from "express";

// src/modules/customer/customer.service.ts
var getCustomerProfile = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      customerProfile: true,
      bookings: {
        include: {
          service: {
            include: {
              category: true
            }
          },
          technician: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  phone: true
                }
              }
            }
          },
          payment: true,
          review: true
        },
        orderBy: {
          createdAt: "desc"
        }
      }
    }
  });
  if (!user) {
    throw new ApiError(404, "Customer not found");
  }
  if (user.role !== "CUSTOMER") {
    throw new ApiError(400, "User is not a customer");
  }
  return user;
};
var updateCustomerProfile = async (userId, input) => {
  const userData = {};
  if (input.name !== void 0) userData.name = input.name;
  if (input.phone !== void 0) userData.phone = input.phone || null;
  const profileData = {};
  if (input.address !== void 0) profileData.address = input.address || null;
  if (input.city !== void 0) profileData.city = input.city || null;
  if (input.postalCode !== void 0) profileData.postalCode = input.postalCode || null;
  const updatedUser = await prisma.$transaction(async (tx) => {
    const user = await tx.user.update({
      where: { id: userId },
      data: userData
    });
    await tx.customerProfile.upsert({
      where: { userId },
      update: profileData,
      create: {
        userId,
        ...profileData
      }
    });
    return user;
  });
  return getCustomerProfile(userId);
};
var getCustomerBookings = async (userId) => {
  const bookings = await prisma.booking.findMany({
    where: { customerId: userId },
    include: {
      service: {
        include: {
          category: true
        }
      },
      technician: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true
            }
          }
        }
      },
      payment: true,
      review: true
    },
    orderBy: {
      createdAt: "desc"
    }
  });
  return bookings;
};

// src/modules/customer/customer.controller.ts
var getMyProfileController2 = catchAsync(async (req, res) => {
  if (!req.user) {
    throw new ApiError(401, "User not authenticated");
  }
  if (req.user.role !== "CUSTOMER") {
    throw new ApiError(400, "Access denied. Customer only.");
  }
  const profile = await getCustomerProfile(req.user.id);
  sendResponse(res, 200, "Customer profile fetched successfully", profile);
});
var updateMyProfileController2 = catchAsync(async (req, res) => {
  if (!req.user) {
    throw new ApiError(401, "User not authenticated");
  }
  if (req.user.role !== "CUSTOMER") {
    throw new ApiError(400, "Access denied. Customer only.");
  }
  const input = req.body;
  const profile = await updateCustomerProfile(req.user.id, input);
  sendResponse(res, 200, "Customer profile updated successfully", profile);
});
var getMyBookingsController2 = catchAsync(async (req, res) => {
  if (!req.user) {
    throw new ApiError(401, "User not authenticated");
  }
  if (req.user.role !== "CUSTOMER") {
    throw new ApiError(400, "Access denied. Customer only.");
  }
  const bookings = await getCustomerBookings(req.user.id);
  sendResponse(res, 200, "Bookings fetched successfully", bookings);
});

// src/modules/customer/customer.validation.ts
import { z as z8 } from "zod";
var updateCustomerProfileSchema = z8.object({
  body: z8.object({
    name: z8.string().min(2, "Name must be at least 2 characters").optional(),
    phone: z8.string().optional(),
    address: z8.string().optional(),
    city: z8.string().optional(),
    postalCode: z8.string().optional()
  })
});

// src/modules/customer/customer.route.ts
var router9 = Router9();
router9.use(protect, restrictTo("CUSTOMER"));
router9.get("/profile", getMyProfileController2);
router9.put("/profile", validate(updateCustomerProfileSchema), updateMyProfileController2);
router9.get("/bookings", getMyBookingsController2);
var customer_route_default = router9;

// src/modules/reviews/reviews.route.ts
import { Router as Router10 } from "express";

// src/modules/reviews/reviews.service.ts
import { BookingStatus } from "@prisma/client";
var createReview = async (customerId, input) => {
  const { bookingId, rating, comment } = input;
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: {
      technician: true,
      customer: true
    }
  });
  if (!booking) {
    throw new ApiError(404, "Booking not found");
  }
  if (booking.customerId !== customerId) {
    throw new ApiError(403, "You can only review your own bookings");
  }
  if (booking.status !== BookingStatus.COMPLETED) {
    throw new ApiError(400, "Booking must be completed before leaving a review");
  }
  const existingReview = await prisma.review.findUnique({
    where: { bookingId }
  });
  if (existingReview) {
    throw new ApiError(409, "Review already exists for this booking");
  }
  const review = await prisma.review.create({
    data: {
      bookingId,
      customerId,
      technicianId: booking.technicianId,
      rating,
      comment: comment || null
    },
    include: {
      customer: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          profileImage: true
        }
      },
      technician: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
              profileImage: true
            }
          }
        }
      },
      booking: {
        include: {
          service: {
            select: {
              id: true,
              title: true,
              price: true
            }
          }
        }
      }
    }
  });
  await updateTechnicianRating(booking.technicianId);
  return review;
};
var getReviewsByTechnician = async (technicianId) => {
  const technician = await prisma.technicianProfile.findUnique({
    where: { id: technicianId }
  });
  if (!technician) {
    throw new ApiError(404, "Technician not found");
  }
  return prisma.review.findMany({
    where: { technicianId },
    include: {
      customer: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          profileImage: true
        }
      },
      booking: {
        include: {
          service: {
            select: {
              id: true,
              title: true,
              price: true
            }
          }
        }
      }
    },
    orderBy: {
      createdAt: "desc"
    }
  });
};
var getMyReviews = async (userId) => {
  const technician = await prisma.technicianProfile.findUnique({
    where: { userId }
  });
  if (!technician) {
    throw new ApiError(404, "Technician profile not found");
  }
  return prisma.review.findMany({
    where: { technicianId: technician.id },
    include: {
      customer: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          profileImage: true
        }
      },
      booking: {
        include: {
          service: {
            select: {
              id: true,
              title: true,
              price: true
            }
          }
        }
      }
    },
    orderBy: {
      createdAt: "desc"
    }
  });
};
var getAverageRating = async (technicianId) => {
  const result = await prisma.review.aggregate({
    where: { technicianId },
    _avg: {
      rating: true
    },
    _count: {
      rating: true
    }
  });
  return {
    averageRating: result._avg.rating || 0,
    totalReviews: result._count.rating || 0
  };
};
var updateTechnicianRating = async (technicianId) => {
  const result = await prisma.review.aggregate({
    where: { technicianId },
    _avg: {
      rating: true
    },
    _count: {
      rating: true
    }
  });
  await prisma.technicianProfile.update({
    where: { id: technicianId },
    data: {
      avgRating: result._avg.rating || 0,
      totalReviews: result._count.rating || 0
    }
  });
};

// src/modules/reviews/reviews.controller.ts
var createReviewController = catchAsync(async (req, res) => {
  if (!req.user) {
    throw new ApiError(401, "User not authenticated");
  }
  if (req.user.role !== "CUSTOMER") {
    throw new ApiError(403, "Only customers can create reviews");
  }
  const input = req.body;
  const review = await createReview(req.user.id, input);
  sendResponse(res, 201, "Review created successfully", review);
});
var getTechnicianReviewsController = catchAsync(async (req, res) => {
  const { technicianId } = req.params;
  if (!technicianId || typeof technicianId !== "string") {
    throw new ApiError(400, "Invalid technician ID");
  }
  const [reviews, rating] = await Promise.all([
    getReviewsByTechnician(technicianId),
    getAverageRating(technicianId)
  ]);
  sendResponse(res, 200, "Reviews fetched successfully", {
    reviews,
    ...rating
  });
});
var getMyReviewsController = catchAsync(async (req, res) => {
  if (!req.user) {
    throw new ApiError(401, "User not authenticated");
  }
  if (req.user.role !== "TECHNICIAN") {
    throw new ApiError(403, "Only technicians can view their reviews");
  }
  const [reviews, rating] = await Promise.all([
    getMyReviews(req.user.id),
    getAverageRating((await getMyReviews(req.user.id))[0]?.technicianId || "")
  ]);
  sendResponse(res, 200, "My reviews fetched successfully", {
    reviews,
    ...rating
  });
});

// src/modules/reviews/reviews.validation.ts
import { z as z9 } from "zod";
var createReviewSchema = z9.object({
  body: z9.object({
    bookingId: z9.string().min(1, "Booking ID is required"),
    rating: z9.number().min(1, "Rating must be at least 1").max(5, "Rating must be at most 5"),
    comment: z9.string().optional()
  })
});

// src/modules/reviews/reviews.route.ts
var router10 = Router10();
router10.get("/technician/:technicianId", getTechnicianReviewsController);
router10.use(protect);
router10.post("/", restrictTo("CUSTOMER"), validate(createReviewSchema), createReviewController);
router10.get("/my", restrictTo("TECHNICIAN"), getMyReviewsController);
var reviews_route_default = router10;

// src/modules/payments/payments.route.ts
import { Router as Router11 } from "express";

// src/lib/stripe.ts
import Stripe from "stripe";
if (!config_default.stripe_secret_key) {
  throw new Error("STRIPE_SECRET_KEY is not defined in environment variables");
}
var stripe = new Stripe(config_default.stripe_secret_key, {
  apiVersion: "2026-06-24.dahlia",
  typescript: true
});
var createPaymentIntent = async (amount, currency = "usd", metadata = {}) => {
  return stripe.paymentIntents.create({
    amount: Math.round(amount * 100),
    currency,
    metadata
  });
};
var retrievePaymentIntent = async (paymentIntentId) => {
  return stripe.paymentIntents.retrieve(paymentIntentId);
};

// src/modules/payments/payments.service.ts
import { PaymentProvider, PaymentStatus, BookingStatus as BookingStatus2 } from "@prisma/client";
var createPayment = async (userId, input) => {
  const { bookingId } = input;
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: {
      customer: true,
      technician: {
        include: {
          user: true
        }
      },
      service: true
    }
  });
  if (!booking) {
    throw new ApiError(404, "Booking not found");
  }
  if (booking.customerId !== userId) {
    throw new ApiError(403, "You can only pay for your own bookings");
  }
  if (booking.status !== BookingStatus2.ACCEPTED) {
    throw new ApiError(400, "Booking must be accepted before payment");
  }
  const existingPayment = await prisma.payment.findUnique({
    where: { bookingId }
  });
  if (existingPayment) {
    throw new ApiError(409, "Payment already exists for this booking");
  }
  const paymentIntent = await createPaymentIntent(booking.totalAmount, "usd", {
    bookingId: booking.id,
    customerId: userId,
    technicianId: booking.technicianId,
    serviceId: booking.serviceId
  });
  const payment = await prisma.payment.create({
    data: {
      bookingId: booking.id,
      userId,
      transactionId: paymentIntent.id,
      // ✅ Changed from providerId to transactionId
      amount: booking.totalAmount,
      method: "card",
      provider: PaymentProvider.STRIPE,
      status: PaymentStatus.PENDING
      // currency field removed - not in schema
    }
  });
  return {
    payment,
    clientSecret: paymentIntent.client_secret,
    paymentIntentId: paymentIntent.id
  };
};
var confirmPayment = async (paymentIntentId) => {
  const paymentIntent = await retrievePaymentIntent(paymentIntentId);
  const payment = await prisma.payment.findFirst({
    where: { transactionId: paymentIntentId },
    // ✅ Changed from providerId to transactionId
    include: {
      booking: {
        include: {
          customer: true,
          technician: {
            include: {
              user: true
            }
          },
          service: true
        }
      }
    }
  });
  if (!payment) {
    throw new ApiError(404, "Payment not found");
  }
  let status;
  let paidAt = null;
  switch (paymentIntent.status) {
    case "succeeded":
      status = PaymentStatus.COMPLETED;
      paidAt = /* @__PURE__ */ new Date();
      break;
    case "canceled":
    case "requires_payment_method":
      status = PaymentStatus.FAILED;
      break;
    default:
      status = PaymentStatus.PENDING;
  }
  const updatedPayment = await prisma.payment.update({
    where: { id: payment.id },
    data: {
      status,
      paidAt
    },
    include: {
      booking: {
        include: {
          customer: true,
          technician: {
            include: {
              user: true
            }
          },
          service: true
        }
      }
    }
  });
  if (status === PaymentStatus.COMPLETED) {
    await prisma.booking.update({
      where: { id: payment.bookingId },
      data: { status: BookingStatus2.PAID }
    });
  }
  return updatedPayment;
};
var getPaymentHistory = async (userId) => {
  return prisma.payment.findMany({
    where: { userId },
    include: {
      booking: {
        include: {
          service: true,
          technician: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true
                }
              }
            }
          }
        }
      }
    },
    orderBy: {
      createdAt: "desc"
    }
  });
};
var getPaymentById = async (paymentId, userId) => {
  const payment = await prisma.payment.findUnique({
    where: { id: paymentId },
    include: {
      booking: {
        include: {
          service: true,
          technician: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true
                }
              }
            }
          }
        }
      }
    }
  });
  if (!payment) {
    throw new ApiError(404, "Payment not found");
  }
  if (payment.userId !== userId) {
    throw new ApiError(403, "You can only view your own payments");
  }
  return payment;
};
var handleStripeWebhook = async (event) => {
  switch (event.type) {
    case "payment_intent.succeeded":
      await confirmPayment(event.data.object.id);
      break;
    case "payment_intent.payment_failed":
      const paymentIntent = event.data.object;
      await prisma.payment.updateMany({
        where: { transactionId: paymentIntent.id },
        // ✅ Changed from providerId to transactionId
        data: { status: PaymentStatus.FAILED }
      });
      break;
    default:
      console.log(`Unhandled event type: ${event.type}`);
  }
};

// src/modules/payments/payments.controller.ts
var createPaymentController = catchAsync(async (req, res) => {
  if (!req.user) {
    throw new ApiError(401, "User not authenticated");
  }
  const input = req.body;
  const result = await createPayment(req.user.id, input);
  sendResponse(res, 201, "Payment initiated successfully", result);
});
var confirmPaymentController = catchAsync(async (req, res) => {
  const { paymentIntentId } = req.body;
  const payment = await confirmPayment(paymentIntentId);
  sendResponse(res, 200, "Payment confirmed successfully", payment);
});
var getPaymentHistoryController = catchAsync(async (req, res) => {
  if (!req.user) {
    throw new ApiError(401, "User not authenticated");
  }
  const payments = await getPaymentHistory(req.user.id);
  sendResponse(res, 200, "Payment history fetched successfully", payments);
});
var getPaymentByIdController = catchAsync(async (req, res) => {
  if (!req.user) {
    throw new ApiError(401, "User not authenticated");
  }
  const { id } = req.params;
  if (!id || typeof id !== "string") {
    throw new ApiError(400, "Invalid payment ID");
  }
  const payment = await getPaymentById(id, req.user.id);
  sendResponse(res, 200, "Payment fetched successfully", payment);
});
var webhookController = catchAsync(async (req, res) => {
  const sig = req.headers["stripe-signature"];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    throw new ApiError(500, "Webhook secret not configured");
  }
  const event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  await handleStripeWebhook(event);
  sendResponse(res, 200, "Webhook processed successfully");
});

// src/modules/payments/payments.validation.ts
import { z as z10 } from "zod";
var createPaymentSchema = z10.object({
  body: z10.object({
    bookingId: z10.string().min(1, "Booking ID is required")
  })
});
var confirmPaymentSchema = z10.object({
  body: z10.object({
    paymentIntentId: z10.string().min(1, "Payment Intent ID is required")
  })
});

// src/modules/payments/payments.route.ts
import express from "express";
var router11 = Router11();
router11.post("/webhook", express.raw({ type: "application/json" }), webhookController);
router11.use(protect);
router11.post("/create", validate(createPaymentSchema), createPaymentController);
router11.post("/confirm", validate(confirmPaymentSchema), confirmPaymentController);
router11.get("/", getPaymentHistoryController);
router11.get("/:id", getPaymentByIdController);
var payments_route_default = router11;

// src/app.ts
var app = express2();
app.use(
  cors({
    origin: config_default.cors_origin,
    credentials: true
  })
);
app.use(express2.json());
app.use(express2.urlencoded({ extended: true }));
app.use(cookieParser());
app.get("/", (req, res) => {
  sendResponse(res, 200, "Hi! I am Running", {
    status: "OK",
    timestamp: (/* @__PURE__ */ new Date()).toISOString()
  });
});
app.get("/health", (req, res) => {
  sendResponse(res, 200, "Server is healthy", {
    status: "OK",
    timestamp: (/* @__PURE__ */ new Date()).toISOString()
  });
});
app.use("/api/auth", auth_route_default);
app.use("/api/users", users_route_default);
app.use("/api/admin", admin_route_default);
app.use("/api/admin-profile", admin_profile_route_default);
app.use("/api/categories", categories_route_default);
app.use("/api/services", services_route_default);
app.use("/api/technicians", technicians_route_default);
app.use("/api/bookings", bookings_route_default);
app.use("/api/customer", customer_route_default);
app.use("/api/reviews", reviews_route_default);
app.use("/api/payments", payments_route_default);
app.use(notFoundHandler);
app.use(globalErrorHandler);
var app_default = app;
export {
  app_default as default
};
//# sourceMappingURL=app.js.map