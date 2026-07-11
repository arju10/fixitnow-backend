# 📚 FixItNow Backend API - Complete Documentation
 ## Postman Collection: https://www.postman.com/speeding-eclipse-199364/fixitnow-backend/collection/15474628-1c7e96c9-2c3a-41a2-8ad5-7649f536c7c7?action=share&source=copy-link&creator=15474628
---

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Getting Started](#getting-started)
4. [Project Structure](#project-structure)
5. [Database Schema](#database-schema)
6. [API Endpoints](#api-endpoints)
7. [Authentication & Authorization](#authentication--authorization)
8. [Error Handling](#error-handling)
9. [Testing](#testing)
10. [Deployment](#deployment)
11. [Contributing](#contributing)

---

## 🚀 Project Overview

**FixItNow** is a comprehensive home services marketplace backend API. It connects customers with qualified technicians for various home services including plumbing, electrical, cleaning, painting, and HVAC.

### Key Features

| Feature | Description |
|---------|-------------|
| 🔐 **Authentication** | JWT-based authentication with role-based access |
| 👤 **User Management** | Customers, Technicians, and Admins with separate profiles |
| 🛠️ **Service Management** | Create, update, and browse services by category |
| 📅 **Booking System** | Book technicians with availability checking |
| 💳 **Payment Integration** | Stripe payment processing |
| ⭐ **Reviews & Ratings** | Leave reviews and rate technicians |
| 📊 **Admin Dashboard** | Manage users, bookings, and platform stats |

---

## 🛠️ Tech Stack

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | v18+ | Runtime environment |
| Express.js | v5.x | Web framework |
| TypeScript | v6.x | Type safety |
| Prisma ORM | v7.x | Database ORM |
| PostgreSQL | v15+ | Database |
| JWT | - | Authentication |
| Stripe | - | Payment processing |
| Zod | - | Validation |

### Development Tools
| Tool | Purpose |
|------|---------|
| ESLint | Code linting |
| Prettier | Code formatting |
| ts-node-dev | Development server |
| Postman | API testing |
| Stripe CLI | Webhook testing |

---

## 📦 Getting Started

### Prerequisites

```bash
# Required
Node.js (v18 or higher)
PostgreSQL (v15 or higher)
npm or yarn
Git
```

### Installation

```bash
# Clone the repository
git clone https://github.com/arju10/fixitnow-backend.git
cd fixitnow-backend

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env

# Update .env with your credentials
nano .env

# Setup database
npx prisma generate
npx prisma migrate dev --name init
npx prisma db seed

# Start development server
npm run dev
```

### Environment Variables

```env
# Server
PORT=5000
NODE_ENV=development

# Database
DATABASE_URL="your-database-url"

# JWT
JWT_ACCESS_SECRET="your-access-secret-key"
JWT_REFRESH_SECRET="your-refresh-secret-key"
JWT_ACCESS_EXPIRES_IN="1d"
JWT_REFRESH_EXPIRES_IN="7d"

# Stripe
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# CORS
CORS_ORIGIN="*"

# App
APP_URL="http://localhost:3000"
BCRYPT_SALT_ROUNDS=10
```

---

## 📁 Project Structure

```
fixitnow-backend/
├── src/
│   ├── config/
│   │   └── index.ts              # Configuration
│   ├── lib/
│   │   ├── prisma.ts             # Prisma client
│   │   └── stripe.ts             # Stripe client
│   ├── middleware/
│   │   ├── auth.middleware.ts    # Authentication
│   │   ├── error.middleware.ts   # Error handling
│   │   ├── role.middleware.ts    # Role-based access
│   │   └── validate.middleware.ts # Validation
│   ├── modules/
│   │   ├── auth/                 # Authentication module
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.interface.ts
│   │   │   ├── auth.route.ts
│   │   │   ├── auth.service.ts
│   │   │   └── auth.validation.ts
│   │   ├── users/                # User management
│   │   │   ├── users.controller.ts
│   │   │   ├── users.interface.ts
│   │   │   ├── users.route.ts
│   │   │   ├── users.service.ts
│   │   │   └── users.validation.ts
│   │   ├── admin/                # Admin dashboard
│   │   │   ├── admin.controller.ts
│   │   │   └── admin.route.ts
│   │   ├── admin-profile/        # Admin profile
│   │   │   ├── admin-profile.controller.ts
│   │   │   ├── admin-profile.interface.ts
│   │   │   ├── admin-profile.route.ts
│   │   │   ├── admin-profile.service.ts
│   │   │   └── admin-profile.validation.ts
│   │   ├── categories/           # Categories
│   │   │   ├── categories.controller.ts
│   │   │   ├── categories.interface.ts
│   │   │   ├── categories.route.ts
│   │   │   ├── categories.service.ts
│   │   │   └── categories.validation.ts
│   │   ├── services/             # Services
│   │   │   ├── services.controller.ts
│   │   │   ├── services.interface.ts
│   │   │   ├── services.route.ts
│   │   │   ├── services.service.ts
│   │   │   └── services.validation.ts
│   │   ├── technicians/          # Technicians
│   │   │   ├── technicians.controller.ts
│   │   │   ├── technicians.interface.ts
│   │   │   ├── technicians.route.ts
│   │   │   ├── technicians.service.ts
│   │   │   └── technicians.validation.ts
│   │   ├── customer/             # Customers
│   │   │   ├── customer.controller.ts
│   │   │   ├── customer.interface.ts
│   │   │   ├── customer.route.ts
│   │   │   ├── customer.service.ts
│   │   │   └── customer.validation.ts
│   │   ├── bookings/             # Bookings
│   │   │   ├── bookings.controller.ts
│   │   │   ├── bookings.interface.ts
│   │   │   ├── bookings.route.ts
│   │   │   ├── bookings.service.ts
│   │   │   └── bookings.validation.ts
│   │   ├── payments/             # Payments
│   │   │   ├── payments.controller.ts
│   │   │   ├── payments.interface.ts
│   │   │   ├── payments.route.ts
│   │   │   ├── payments.service.ts
│   │   │   └── payments.validation.ts
│   │   └── reviews/              # Reviews
│   │       ├── reviews.controller.ts
│   │       ├── reviews.interface.ts
│   │       ├── reviews.route.ts
│   │       ├── reviews.service.ts
│   │       └── reviews.validation.ts
│   ├── utils/
│   │   ├── ApiError.ts           # Error class
│   │   ├── ApiResponse.ts        # Response helper
│   │   ├── catchAsync.ts         # Async wrapper
│   │   ├── hash.ts               # Password hashing
│   │   └── jwt.ts                # JWT utilities
│   ├── app.ts                    # Express app
│   └── server.ts                 # Server entry
│   └── seed.ts                   # Seed data
├── prisma/
│   ├── schema.prisma             # Database schema
├── .env                          # Environment variables
├── package.json
├── tsconfig.json
└── README.md
```

---

## 🗄️ Database Schema

<!-- ### ER Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│  ┌────────────┐      ┌────────────────────┐      ┌─────────────────────┐   │
│  │    User    │      │ TechnicianProfile  │      │   CustomerProfile   │   │
│  ├────────────┤      ├────────────────────┤      ├─────────────────────┤   │
│  │ id         │◄─────│ userId             │      │ userId              │   │
│  │ name       │      │ bio                │      │ address             │   │
│  │ email      │      │ experienceYrs      │      │ city                │   │
│  │ password   │      │ location           │      │ postalCode          │   │
│  │ phone      │      │ avgRating          │      └─────────────────────┘   │
│  │ role       │      │ totalReviews       │                                │
│  │ status     │      └────────────────────┘                                │
│  └────────────┘                                                           │
│       │                                                                    │
│       │                    ┌────────────────────┐                          │
│       ├────────────────────│   AdminProfile     │                          │
│       │                    ├────────────────────┤                          │
│       │                    │ userId             │                          │
│       │                    │ department         │                          │
│       │                    │ permissions        │                          │
│       │                    │ isSuperAdmin       │                          │
│       │                    └────────────────────┘                          │
│       │                                                                    │
│       │      ┌────────────────────┐      ┌─────────────────────────────┐   │
│       ├──────│     Category       │      │        Service              │   │
│       │      ├────────────────────┤      ├─────────────────────────────┤   │
│       │      │ id                 │◄─────│ categoryId                  │   │
│       │      │ name               │      │ technicianId                │───┼──┐
│       │      │ description        │      │ title                       │   │  │
│       │      └────────────────────┘      │ description                 │   │  │
│       │                                   │ price                       │   │  │
│       │                                   │ durationMins                │   │  │
│       │                                   │ isActive                    │   │  │
│       │                                   └─────────────────────────────┘   │  │
│       │                                                                     │  │
│       │      ┌────────────────────┐      ┌─────────────────────────────┐   │  │
│       ├──────│   AvailabilitySlot │      │         Booking             │   │  │
│       │      ├────────────────────┤      ├─────────────────────────────┤   │  │
│       │      │ id                 │      │ id                          │   │  │
│       │      │ technicianId       │─────►│ technicianId                │◄──┼──┘
│       │      │ dayOfWeek          │      │ customerId                  │───┼──┐
│       │      │ startTime          │      │ serviceId                   │   │  │
│       │      │ endTime            │      │ scheduledAt                 │   │  │
│       │      │ isActive           │      │ status                      │   │  │
│       │      └────────────────────┘      │ totalAmount                 │   │  │
│       │                                   │ notes                       │   │  │
│       │                                   └─────────────────────────────┘   │  │
│       │                                                                     │  │
│       │      ┌────────────────────┐      ┌─────────────────────────────┐   │  │
│       ├──────│      Payment       │      │         Review              │   │  │
│       │      ├────────────────────┤      ├─────────────────────────────┤   │  │
│       │      │ id                 │      │ id                          │   │  │
│       │      │ bookingId          │─────►│ bookingId                   │   │  │
│       │      │ userId             │─────►│ customerId                  │   │  │
│       │      │ transactionId      │      │ technicianId                │   │  │
│       │      │ amount             │      │ rating                      │   │  │
│       │      │ method             │      │ comment                     │   │  │
│       │      │ provider           │      └─────────────────────────────┘   │  │
│       │      │ status             │                                         │  │
│       │      │ paidAt             │                                         │  │
│       │      └────────────────────┘                                         │  │
│       │                                                                     │  │
└───────┴─────────────────────────────────────────────────────────────────────┘
``` -->

### Enums

```prisma
enum Role {
  CUSTOMER
  TECHNICIAN
  ADMIN
}

enum UserStatus {
  ACTIVE
  BANNED
}

enum BookingStatus {
  REQUESTED
  ACCEPTED
  DECLINED
  PAID
  IN_PROGRESS
  COMPLETED
  CANCELLED
}

enum PaymentStatus {
  PENDING
  COMPLETED
  FAILED
  REFUNDED
}

enum PaymentProvider {
  STRIPE
  SSLCOMMERZ
}
```

### Models

<details>
<summary><b>User</b></summary>

```prisma
model User {
  id           String     @id @default(uuid())
  name         String
  email        String     @unique
  password     String
  phone        String?
  profileImage String?
  role         Role       @default(CUSTOMER)
  status       UserStatus @default(ACTIVE)
  createdAt    DateTime   @default(now())
  updatedAt    DateTime   @updatedAt

  technicianProfile TechnicianProfile?
  customerProfile   CustomerProfile?
  adminProfile      AdminProfile?
  bookings          Booking[]          @relation("CustomerBookings")
  reviews           Review[]           @relation("CustomerReviews")
  payments          Payment[]

  @@map("users")
}
```
</details>

<details>
<summary><b>TechnicianProfile</b></summary>

```prisma
model TechnicianProfile {
  id            String   @id @default(uuid())
  userId        String   @unique
  bio           String?
  experienceYrs Int      @default(0)
  location      String?
  avgRating     Float    @default(0)
  totalReviews  Int      @default(0)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  user         User               @relation(fields: [userId], references: [id], onDelete: Cascade)
  services     Service[]
  availability AvailabilitySlot[]
  bookings     Booking[]          @relation("TechnicianBookings")
  reviews      Review[]           @relation("TechnicianReviews")

  @@map("technician_profiles")
}
```
</details>

<details>
<summary><b>CustomerProfile</b></summary>

```prisma
model CustomerProfile {
  id         String   @id @default(uuid())
  userId     String   @unique
  address    String?
  city       String?
  postalCode String?
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("customer_profiles")
}
```
</details>

<details>
<summary><b>AdminProfile</b></summary>

```prisma
model AdminProfile {
  id           String   @id @default(uuid())
  userId       String   @unique
  department   String?
  permissions  String[] @default([])
  isSuperAdmin Boolean  @default(false)
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("admin_profiles")
}
```
</details>

<details>
<summary><b>Category</b></summary>

```prisma
model Category {
  id          String   @id @default(uuid())
  name        String   @unique
  description String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @default(now())

  services Service[]

  @@map("categories")
}
```
</details>

<details>
<summary><b>Service</b></summary>

```prisma
model Service {
  id           String   @id @default(uuid())
  technicianId String
  categoryId   String
  title        String
  description  String?
  price        Float
  durationMins Int      @default(60)
  isActive     Boolean  @default(true)
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  technician TechnicianProfile @relation(fields: [technicianId], references: [id], onDelete: Cascade)
  category   Category          @relation(fields: [categoryId], references: [id])
  bookings   Booking[]

  @@map("services")
}
```
</details>

<details>
<summary><b>AvailabilitySlot</b></summary>

```prisma
model AvailabilitySlot {
  id           String   @id @default(uuid())
  technicianId String
  dayOfWeek    Int
  startTime    String
  endTime      String
  isActive     Boolean  @default(true)
  createdAt    DateTime @default(now())

  technician TechnicianProfile @relation(fields: [technicianId], references: [id], onDelete: Cascade)

  @@map("availability_slots")
}
```
</details>

<details>
<summary><b>Booking</b></summary>

```prisma
model Booking {
  id           String        @id @default(uuid())
  customerId   String
  technicianId String
  serviceId    String
  scheduledAt  DateTime
  status       BookingStatus @default(REQUESTED)
  totalAmount  Float
  notes        String?
  createdAt    DateTime      @default(now())
  updatedAt    DateTime      @updatedAt

  customer   User              @relation("CustomerBookings", fields: [customerId], references: [id])
  technician TechnicianProfile @relation("TechnicianBookings", fields: [technicianId], references: [id])
  service    Service           @relation(fields: [serviceId], references: [id])
  payment    Payment?
  review     Review?

  @@map("bookings")
}
```
</details>

<details>
<summary><b>Payment</b></summary>

```prisma
model Payment {
  id            String          @id @default(uuid())
  bookingId     String          @unique
  userId        String
  transactionId String          @unique
  amount        Float
  method        String          @default("card")
  provider      PaymentProvider @default(STRIPE)
  status        PaymentStatus   @default(PENDING)
  paidAt        DateTime?
  createdAt     DateTime        @default(now())
  updatedAt     DateTime        @updatedAt

  booking Booking @relation(fields: [bookingId], references: [id])
  user    User    @relation(fields: [userId], references: [id])

  @@map("payments")
}
```
</details>

<details>
<summary><b>Review</b></summary>

```prisma
model Review {
  id           String   @id @default(uuid())
  bookingId    String   @unique
  customerId   String
  technicianId String
  rating       Int
  comment      String?
  createdAt    DateTime @default(now())

  booking    Booking           @relation(fields: [bookingId], references: [id])
  customer   User              @relation("CustomerReviews", fields: [customerId], references: [id])
  technician TechnicianProfile @relation("TechnicianReviews", fields: [technicianId], references: [id])

  @@map("reviews")
}
```
</details>

---

## 🔗 API Endpoints

### Authentication

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/auth/register` | Register new user | Public |
| POST | `/api/auth/login` | Login user | Public |
| GET | `/api/auth/me` | Get current user | Private |

#### Register Request
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "+1234567890",
  "role": "CUSTOMER"
}
```

#### Login Request
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Login Response
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "uuid",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "CUSTOMER"
    },
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

---

### Categories

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/categories` | Get all categories | Public |
| GET | `/api/categories/:id` | Get category by ID | Public |
| POST | `/api/categories` | Create category | Admin |
| PUT | `/api/categories/:id` | Update category | Admin |
| DELETE | `/api/categories/:id` | Delete category | Admin |

#### Create Category
```json
{
  "name": "Plumbing",
  "description": "Pipe fitting, faucet repair, drainage services"
}
```

---

### Services

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/services` | Get all services | Public |
| GET | `/api/services/:id` | Get service by ID | Public |
| GET | `/api/services/my` | Get my services | Technician |
| POST | `/api/services` | Create service | Technician |
| PUT | `/api/services/:id` | Update service | Technician/Admin |
| DELETE | `/api/services/:id` | Delete service | Technician/Admin |

#### Create Service
```json
{
  "categoryId": "uuid",
  "title": "Leak Repair",
  "description": "Fix leaking pipes and faucets",
  "price": 45,
  "durationMins": 60
}
```

---

### Technicians

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/technicians` | Get all technicians | Public |
| GET | `/api/technicians/:id` | Get technician by ID | Public |
| GET | `/api/technicians/profile` | Get my profile | Technician |
| PUT | `/api/technicians/profile` | Update my profile | Technician |
| POST | `/api/technicians/availability` | Add availability slot | Technician |
| GET | `/api/technicians/availability` | Get my availability | Technician |
| DELETE | `/api/technicians/availability/:id` | Delete availability slot | Technician |

---

### Customer

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/customer/profile` | Get customer profile | Customer |
| PUT | `/api/customer/profile` | Update customer profile | Customer |
| GET | `/api/customer/bookings` | Get customer bookings | Customer |

---

### Bookings

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/bookings` | Create booking | Customer |
| GET | `/api/bookings` | Get my bookings | All |
| GET | `/api/bookings/:id` | Get booking by ID | All |
| PATCH | `/api/bookings/:id/status` | Update booking status | Technician/Admin |
| PATCH | `/api/bookings/:id/cancel` | Cancel booking | Customer |

#### Booking Status Flow

```
REQUESTED → ACCEPTED → PAID → IN_PROGRESS → COMPLETED
    ↓           ↓        ↓         ↓
 DECLINED   CANCELLED  CANCELLED  CANCELLED
```

#### Create Booking Request
```json
{
  "serviceId": "uuid",
  "scheduledAt": "2026-08-01T09:00:00.000Z",
  "notes": "Please bring all necessary tools"
}
```

#### Update Booking Status
```json
{
  "status": "ACCEPTED"
}
```

---

### Payments

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/payments/webhook` | Stripe webhook | Public |
| POST | `/api/payments/create` | Create payment | Customer |
| POST | `/api/payments/confirm` | Confirm payment | Customer |
| GET | `/api/payments` | Get payment history | Customer |
| GET | `/api/payments/:id` | Get payment by ID | Customer |

#### Create Payment
```json
{
  "bookingId": "uuid"
}
```

#### Confirm Payment
```json
{
  "paymentIntentId": "pi_xxxxxxxxxxxxx"
}
```

---

### Reviews

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/reviews` | Create review | Customer |
| GET | `/api/reviews/technician/:technicianId` | Get technician reviews | Public |
| GET | `/api/reviews/my` | Get my reviews | Technician |

#### Create Review
```json
{
  "bookingId": "uuid",
  "rating": 5,
  "comment": "Excellent and professional service!"
}
```

---

### Admin

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/admin/users` | Get all users | Admin |
| GET | `/api/admin/bookings` | Get all bookings | Admin |
| GET | `/api/admin/stats` | Get dashboard stats | Admin |

#### Dashboard Stats Response
```json
{
  "success": true,
  "message": "Dashboard stats fetched successfully",
  "data": {
    "totalUsers": 10,
    "totalTechnicians": 5,
    "totalCustomers": 4,
    "totalAdmins": 1,
    "totalBookings": 25,
    "completedBookings": 15,
    "totalRevenue": 1250.50,
    "recentBookings": []
  }
}
```

---

### Admin Profile

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/admin-profile/profile` | Get admin profile | Admin |
| PUT | `/api/admin-profile/profile` | Update admin profile | Admin |

#### Update Admin Profile
```json
{
  "department": "IT",
  "permissions": ["manage_users", "manage_bookings", "manage_categories"],
  "isSuperAdmin": true
}
```

---

### Users

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/users` | Get all users | Admin |
| GET | `/api/users/:id` | Get user by ID | Admin |
| PUT | `/api/users/:id` | Update user profile | Self/Admin |
| PATCH | `/api/users/:id/status` | Update user status | Admin |
| DELETE | `/api/users/:id` | Delete user | Self/Admin |
| GET | `/api/users/stats` | Get dashboard stats | Admin |

#### Update User Status
```json
{
  "status": "BANNED"
}
```

---

## 🔐 Authentication & Authorization

### JWT Tokens

The API uses JWT (JSON Web Tokens) for authentication.

**Token Structure:**
```json
{
  "userId": "uuid",
  "email": "user@example.com",
  "role": "CUSTOMER"
}
```

### Role-Based Access

| Role | Permissions |
|------|-------------|
| **Customer** | Create bookings, view services, leave reviews, make payments |
| **Technician** | Manage services, view bookings, update booking status |
| **Admin** | Manage users, view all bookings, manage categories |

### Authentication Flow

```
1. User registers → Creates account
2. User logs in → Receives JWT token
3. Include token in requests → Authorization: Bearer <token>
4. Server validates token → Grants access
```

---

## 🚨 Error Handling

### Error Response Format

```json
{
  "success": false,
  "message": "Error message",
  "errorDetails": "Detailed error information (in development)"
}
```

### HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 409 | Conflict |
| 500 | Internal Server Error |

### Common Errors

| Error | Cause | Solution |
|-------|-------|----------|
| `User with this email already exists` | Duplicate email | Use a different email |
| `Invalid credentials` | Wrong email/password | Check credentials |
| `No token provided` | Missing authorization header | Add Bearer token |
| `Insufficient permissions` | Role lacks access | Use correct role |
| `Route not found` | Invalid endpoint | Check URL |

---

## 🧪 Testing

### Test Credentials

After running `npm run prisma:seed`, you can use these credentials:

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@fixitnow.com` | `admin123` |
| Plumber | `tech1@fixitnow.com` | `tech123` |
| Electrician | `tech2@fixitnow.com` | `tech123` |
| Cleaner | `tech3@fixitnow.com` | `tech123` |
| Painter | `tech4@fixitnow.com` | `tech123` |
| HVAC | `tech5@fixitnow.com` | `tech123` |
| Customer 1 | `customer1@fixitnow.com` | `customer123` |
| Customer 2 | `customer2@fixitnow.com` | `customer123` |
| Customer 3 | `customer3@fixitnow.com` | `customer123` |

### Postman Collection

A complete Postman collection is available in the repository.

### Seed Data

```bash
npm run prisma:seed
```

---

## 🚀 Deployment

### Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Build the project
npm run build

# Deploy
vercel
```

### Environment Variables for Production

```env
PORT=5000
NODE_ENV=production
DATABASE_URL=your_production_database_url
JWT_ACCESS_SECRET=your_secure_jwt_secret
STRIPE_SECRET_KEY=your_stripe_secret_key
```

---

## 📝 Contributing

### Development Workflow

```bash
# Clone the repository
git clone https://github.com/arju10/fixitnow-backend.git

# Install dependencies
npm install

# Create a new branch
git checkout -b feature/your-feature

# Make changes and commit
git add .
git commit -m "feat: add new feature"

# Push changes
git push origin feature/your-feature

# Create a pull request
```

### Commit Convention

| Prefix | Use Case |
|--------|----------|
| `feat:` | New feature |
| `fix:` | Bug fix |
| `docs:` | Documentation |
| `chore:` | Maintenance |
| `refactor:` | Code refactor |
| `test:` | Testing |
| `style:` | Code style |

---

## 📄 License

MIT

---

## 🆘 Support

For support, please contact:

- **Email**: mst.tahminajerinarju@gmail.com
- **GitHub Issues**: [Create an issue](https://github.com/arju10/fixitnow-backend/issues)

---

## 🙏 Acknowledgments

- Stripe for payment processing
- Prisma for database ORM
- Express.js for web framework
- All contributors

---

