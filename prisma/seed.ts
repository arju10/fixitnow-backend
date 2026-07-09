import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Hash password
  const hashedPassword = await bcrypt.hash('admin123', 10);

  // Create admin user
  const admin = await prisma.user.upsert({
    where: { email: 'admin@fixitnow.com' },
    update: {},
    create: {
      email: 'admin@fixitnow.com',
      password: hashedPassword,
      name: 'Admin User',
      phone: '+1234567890',
      role: 'ADMIN', 
      status: 'ACTIVE',
    },
  });

  console.log('Admin created:', admin.email);

  // Create sample categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { name: 'Plumbing' },
      update: {},
      create: {
        name: 'Plumbing',
        description: 'Professional plumbing services',
      },
    }),
    prisma.category.upsert({
      where: { name: 'Electrical' },
      update: {},
      create: {
        name: 'Electrical',
        description: 'Expert electrical services',
      },
    }),
    prisma.category.upsert({
      where: { name: 'Cleaning' },
      update: {},
      create: {
        name: 'Cleaning',
        description: 'Professional cleaning services',
      },
    }),
    prisma.category.upsert({
      where: { name: 'Painting' },
      update: {},
      create: {
        name: 'Painting',
        description: 'Expert painting services',
      },
    }),
  ]);

  console.log('Categories created');

  // Create sample technician
  const techPassword = await bcrypt.hash('tech123', 10);
  const technician = await prisma.user.upsert({
    where: { email: 'tech@fixitnow.com' },
    update: {},
    create: {
      email: 'tech@fixitnow.com',
      password: techPassword,
      name: 'John Technician',
      phone: '+1234567891',
      role: 'TECHNICIAN',
      status: 'ACTIVE',
      technicianProfile: {
        create: {
          bio: 'Experienced home service professional with 5+ years',
          experienceYrs: 5,
          location: 'New York, NY',
        },
      },
    },
  });

  console.log('Technician created');

  // Create sample customer
  const customerPassword = await bcrypt.hash('customer123', 10);
  const customer = await prisma.user.upsert({
    where: { email: 'customer@fixitnow.com' },
    update: {},
    create: {
      email: 'customer@fixitnow.com',
      password: customerPassword,
      name: 'Jane Customer',
      phone: '+1234567892',
      role: 'CUSTOMER',
      status: 'ACTIVE',
    },
  });

  console.log('Customer created');

  console.log('\nSeeding completed successfully!');
  console.log('\n Login Credentials:');
  console.log('Admin: admin@fixitnow.com / admin123');
  console.log('Technician: tech@fixitnow.com / tech123');
  console.log('Customer: customer@fixitnow.com / customer123');
}

main()
  .catch((e) => {
    console.error('Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
