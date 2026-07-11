import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient, Role, BookingStatus, PaymentStatus, PaymentProvider } from '@prisma/client';
import bcrypt from 'bcryptjs';
// Get __dirname equivalent in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// Load .env from root
dotenv.config({ path: resolve(__dirname, '../.env') });
if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL is not defined');
    process.exit(1);
}
// Create PrismaClient with adapter
const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL,
});
const prisma = new PrismaClient({ adapter });
async function main() {
    console.log('🌱 Seeding database with more data...');
    console.log('📋 DATABASE_URL:', process.env.DATABASE_URL ? '✅ Loaded' : '❌ Not found');
    // Hash passwords
    const adminPassword = await bcrypt.hash('admin123', 10);
    const techPassword = await bcrypt.hash('tech123', 10);
    const customerPassword = await bcrypt.hash('customer123', 10);
    console.log('👤 Creating users...');
    // Admin
    const admin = await prisma.user.upsert({
        where: { email: 'admin@fixitnow.com' },
        update: {},
        create: {
            email: 'admin@fixitnow.com',
            password: adminPassword,
            name: 'Super Admin',
            phone: '+8801711111111',
            role: Role.ADMIN,
            status: 'ACTIVE',
            adminProfile: {
                create: {
                    department: 'IT',
                    permissions: [
                        'manage_users',
                        'manage_bookings',
                        'manage_categories',
                        'manage_services',
                        'manage_payments',
                    ],
                    isSuperAdmin: true,
                },
            },
        },
    });
    console.log(`  ✅ Admin: ${admin.email}`);
    // Technicians
    const tech1 = await prisma.user.upsert({
        where: { email: 'tech1@fixitnow.com' },
        update: {},
        create: {
            email: 'tech1@fixitnow.com',
            password: techPassword,
            name: 'John Plumber',
            phone: '+8801722222222',
            role: Role.TECHNICIAN,
            status: 'ACTIVE',
            technicianProfile: {
                create: {
                    bio: 'Expert plumber with 8 years of experience',
                    experienceYrs: 8,
                    location: 'Dhaka, Bangladesh',
                    avgRating: 4.8,
                    totalReviews: 0,
                },
            },
        },
    });
    console.log(`  ✅ Technician: ${tech1.email}`);
    const tech2 = await prisma.user.upsert({
        where: { email: 'tech2@fixitnow.com' },
        update: {},
        create: {
            email: 'tech2@fixitnow.com',
            password: techPassword,
            name: 'Sarah Electrician',
            phone: '+8801733333333',
            role: Role.TECHNICIAN,
            status: 'ACTIVE',
            technicianProfile: {
                create: {
                    bio: 'Certified electrician with 6 years of experience',
                    experienceYrs: 6,
                    location: 'Chittagong, Bangladesh',
                    avgRating: 4.9,
                    totalReviews: 0,
                },
            },
        },
    });
    console.log(`  ✅ Technician: ${tech2.email}`);
    const tech3 = await prisma.user.upsert({
        where: { email: 'tech3@fixitnow.com' },
        update: {},
        create: {
            email: 'tech3@fixitnow.com',
            password: techPassword,
            name: 'Mike Cleaner',
            phone: '+8801744444444',
            role: Role.TECHNICIAN,
            status: 'ACTIVE',
            technicianProfile: {
                create: {
                    bio: 'Professional cleaner with 5 years of experience',
                    experienceYrs: 5,
                    location: 'Dhaka, Bangladesh',
                    avgRating: 4.7,
                    totalReviews: 0,
                },
            },
        },
    });
    console.log(`  ✅ Technician: ${tech3.email}`);
    // Customers
    const customer1 = await prisma.user.upsert({
        where: { email: 'customer1@fixitnow.com' },
        update: {},
        create: {
            email: 'customer1@fixitnow.com',
            password: customerPassword,
            name: 'Alice Johnson',
            phone: '+8801755555555',
            role: Role.CUSTOMER,
            status: 'ACTIVE',
            customerProfile: {
                create: {
                    address: 'House #12, Road #5, Gulshan-1',
                    city: 'Dhaka',
                    postalCode: '1212',
                },
            },
        },
    });
    console.log(`  ✅ Customer: ${customer1.email}`);
    const customer2 = await prisma.user.upsert({
        where: { email: 'customer2@fixitnow.com' },
        update: {},
        create: {
            email: 'customer2@fixitnow.com',
            password: customerPassword,
            name: 'Bob Williams',
            phone: '+8801766666666',
            role: Role.CUSTOMER,
            status: 'ACTIVE',
            customerProfile: {
                create: {
                    address: 'House #45, Road #12, Banani',
                    city: 'Dhaka',
                    postalCode: '1213',
                },
            },
        },
    });
    console.log(`  ✅ Customer: ${customer2.email}`);
    const customer3 = await prisma.user.upsert({
        where: { email: 'customer3@fixitnow.com' },
        update: {},
        create: {
            email: 'customer3@fixitnow.com',
            password: customerPassword,
            name: 'Carol Davis',
            phone: '+8801777777777',
            role: Role.CUSTOMER,
            status: 'ACTIVE',
            customerProfile: {
                create: {
                    address: 'Flat #3B, 56/A, Dhanmondi',
                    city: 'Dhaka',
                    postalCode: '1205',
                },
            },
        },
    });
    console.log(`  ✅ Customer: ${customer3.email}`);
    // ====== ADD MORE TECHNICIANS ======
    const tech4 = await prisma.user.upsert({
        where: { email: 'tech4@fixitnow.com' },
        update: {},
        create: {
            email: 'tech4@fixitnow.com',
            password: techPassword,
            name: 'David Painter',
            phone: '+8801788888888',
            role: Role.TECHNICIAN,
            status: 'ACTIVE',
            technicianProfile: {
                create: {
                    bio: 'Professional painter with 7 years of experience',
                    experienceYrs: 7,
                    location: 'Dhaka, Bangladesh',
                    avgRating: 4.6,
                    totalReviews: 0,
                },
            },
        },
    });
    console.log(`  ✅ Technician: ${tech4.email}`);
    const tech5 = await prisma.user.upsert({
        where: { email: 'tech5@fixitnow.com' },
        update: {},
        create: {
            email: 'tech5@fixitnow.com',
            password: techPassword,
            name: 'Robert HVAC',
            phone: '+8801799999999',
            role: Role.TECHNICIAN,
            status: 'ACTIVE',
            technicianProfile: {
                create: {
                    bio: 'HVAC specialist with 10 years of experience',
                    experienceYrs: 10,
                    location: 'Dhaka, Bangladesh',
                    avgRating: 4.9,
                    totalReviews: 0,
                },
            },
        },
    });
    console.log(`  ✅ Technician: ${tech5.email}`);
    // ====== ADD MORE CUSTOMERS ======
    const customer4 = await prisma.user.upsert({
        where: { email: 'customer4@fixitnow.com' },
        update: {},
        create: {
            email: 'customer4@fixitnow.com',
            password: customerPassword,
            name: 'David Brown',
            phone: '+8801788888888',
            role: Role.CUSTOMER,
            status: 'ACTIVE',
            customerProfile: {
                create: {
                    address: 'House #78, Road #15, Uttara',
                    city: 'Dhaka',
                    postalCode: '1230',
                },
            },
        },
    });
    console.log(`  ✅ Customer: ${customer4.email}`);
    const customer5 = await prisma.user.upsert({
        where: { email: 'customer5@fixitnow.com' },
        update: {},
        create: {
            email: 'customer5@fixitnow.com',
            password: customerPassword,
            name: 'Emily Wilson',
            phone: '+8801799999999',
            role: Role.CUSTOMER,
            status: 'ACTIVE',
            customerProfile: {
                create: {
                    address: 'House #23, Road #8, Mirpur',
                    city: 'Dhaka',
                    postalCode: '1216',
                },
            },
        },
    });
    console.log(`  ✅ Customer: ${customer5.email}`);
    const customer6 = await prisma.user.upsert({
        where: { email: 'customer6@fixitnow.com' },
        update: {},
        create: {
            email: 'customer6@fixitnow.com',
            password: customerPassword,
            name: 'Michael Taylor',
            phone: '+8801700000000',
            role: Role.CUSTOMER,
            status: 'ACTIVE',
            customerProfile: {
                create: {
                    address: 'House #56, Road #3, Motijheel',
                    city: 'Dhaka',
                    postalCode: '1000',
                },
            },
        },
    });
    console.log(`  ✅ Customer: ${customer6.email}`);
    console.log('📂 Creating categories...');
    const categories = await Promise.all([
        prisma.category.upsert({
            where: { name: 'Plumbing' },
            update: {},
            create: {
                name: 'Plumbing',
                description: 'Pipe fitting, faucet repair, drainage services',
            },
        }),
        prisma.category.upsert({
            where: { name: 'Electrical' },
            update: {},
            create: {
                name: 'Electrical',
                description: 'Wiring, fixture installation, electrical repairs',
            },
        }),
        prisma.category.upsert({
            where: { name: 'Cleaning' },
            update: {},
            create: {
                name: 'Cleaning',
                description: 'Home and office cleaning services',
            },
        }),
        prisma.category.upsert({
            where: { name: 'Painting' },
            update: {},
            create: {
                name: 'Painting',
                description: 'Interior and exterior painting services',
            },
        }),
        prisma.category.upsert({
            where: { name: 'HVAC' },
            update: {},
            create: {
                name: 'HVAC',
                description: 'Heating, ventilation, and air conditioning services',
            },
        }),
    ]);
    console.log(`  ✅ ${categories.length} categories created`);
    const [plumbing, electrical, cleaning, painting, hvac] = categories;
    // Get all technician profiles
    const techProfiles = await prisma.technicianProfile.findMany({
        include: { user: true },
    });
    const tech1Profile = techProfiles.find((t) => t.user.email === 'tech1@fixitnow.com');
    const tech2Profile = techProfiles.find((t) => t.user.email === 'tech2@fixitnow.com');
    const tech3Profile = techProfiles.find((t) => t.user.email === 'tech3@fixitnow.com');
    const tech4Profile = techProfiles.find((t) => t.user.email === 'tech4@fixitnow.com');
    const tech5Profile = techProfiles.find((t) => t.user.email === 'tech5@fixitnow.com');
    console.log('🛠️ Creating services...');
    // ====== MORE SERVICES ======
    const services = await Promise.all([
        // Plumbing
        prisma.service.create({
            data: {
                title: 'Leak Repair',
                description: 'Fix leaking pipes and faucets',
                price: 45,
                durationMins: 60,
                categoryId: plumbing.id,
                technicianId: tech1Profile.id,
                isActive: true,
            },
        }),
        prisma.service.create({
            data: {
                title: 'Pipe Installation',
                description: 'Install new pipes for kitchen or bathroom',
                price: 120,
                durationMins: 180,
                categoryId: plumbing.id,
                technicianId: tech1Profile.id,
                isActive: true,
            },
        }),
        prisma.service.create({
            data: {
                title: 'Drain Cleaning',
                description: 'Clear clogged drains and pipes',
                price: 60,
                durationMins: 90,
                categoryId: plumbing.id,
                technicianId: tech1Profile.id,
                isActive: true,
            },
        }),
        prisma.service.create({
            data: {
                title: 'Water Heater Installation',
                description: 'Install new water heater',
                price: 180,
                durationMins: 240,
                categoryId: plumbing.id,
                technicianId: tech1Profile.id,
                isActive: true,
            },
        }),
        // Electrical
        prisma.service.create({
            data: {
                title: 'Wiring Installation',
                description: 'Install new electrical wiring',
                price: 150,
                durationMins: 240,
                categoryId: electrical.id,
                technicianId: tech2Profile.id,
                isActive: true,
            },
        }),
        prisma.service.create({
            data: {
                title: 'Light Fixture Installation',
                description: 'Install ceiling lights, fans, and fixtures',
                price: 75,
                durationMins: 90,
                categoryId: electrical.id,
                technicianId: tech2Profile.id,
                isActive: true,
            },
        }),
        prisma.service.create({
            data: {
                title: 'Electrical Panel Upgrade',
                description: 'Upgrade electrical panel for safety',
                price: 200,
                durationMins: 300,
                categoryId: electrical.id,
                technicianId: tech2Profile.id,
                isActive: true,
            },
        }),
        prisma.service.create({
            data: {
                title: 'Smart Home Wiring',
                description: 'Install smart home electrical systems',
                price: 250,
                durationMins: 360,
                categoryId: electrical.id,
                technicianId: tech2Profile.id,
                isActive: true,
            },
        }),
        // Cleaning
        prisma.service.create({
            data: {
                title: 'Deep Home Cleaning',
                description: 'Complete deep cleaning for your home',
                price: 100,
                durationMins: 240,
                categoryId: cleaning.id,
                technicianId: tech3Profile.id,
                isActive: true,
            },
        }),
        prisma.service.create({
            data: {
                title: 'Office Cleaning',
                description: 'Professional office cleaning services',
                price: 80,
                durationMins: 180,
                categoryId: cleaning.id,
                technicianId: tech3Profile.id,
                isActive: true,
            },
        }),
        prisma.service.create({
            data: {
                title: 'Carpet Cleaning',
                description: 'Deep carpet cleaning and stain removal',
                price: 120,
                durationMins: 150,
                categoryId: cleaning.id,
                technicianId: tech3Profile.id,
                isActive: true,
            },
        }),
        // Painting
        prisma.service.create({
            data: {
                title: 'Interior Painting',
                description: 'Professional interior wall painting',
                price: 200,
                durationMins: 480,
                categoryId: painting.id,
                technicianId: tech4Profile.id,
                isActive: true,
            },
        }),
        prisma.service.create({
            data: {
                title: 'Exterior Painting',
                description: 'Professional exterior wall painting',
                price: 350,
                durationMins: 600,
                categoryId: painting.id,
                technicianId: tech4Profile.id,
                isActive: true,
            },
        }),
        prisma.service.create({
            data: {
                title: 'Wallpaper Installation',
                description: 'Professional wallpaper installation',
                price: 150,
                durationMins: 240,
                categoryId: painting.id,
                technicianId: tech4Profile.id,
                isActive: true,
            },
        }),
        // HVAC
        prisma.service.create({
            data: {
                title: 'AC Installation',
                description: 'Install new air conditioning system',
                price: 300,
                durationMins: 360,
                categoryId: hvac.id,
                technicianId: tech5Profile.id,
                isActive: true,
            },
        }),
        prisma.service.create({
            data: {
                title: 'AC Repair',
                description: 'Repair air conditioning systems',
                price: 120,
                durationMins: 120,
                categoryId: hvac.id,
                technicianId: tech5Profile.id,
                isActive: true,
            },
        }),
        prisma.service.create({
            data: {
                title: 'HVAC Maintenance',
                description: 'Regular HVAC system maintenance',
                price: 80,
                durationMins: 90,
                categoryId: hvac.id,
                technicianId: tech5Profile.id,
                isActive: true,
            },
        }),
        prisma.service.create({
            data: {
                title: 'Duct Cleaning',
                description: 'Professional duct cleaning services',
                price: 180,
                durationMins: 180,
                categoryId: hvac.id,
                technicianId: tech5Profile.id,
                isActive: true,
            },
        }),
    ]);
    console.log(`  ✅ ${services.length} services created`);
    console.log('📅 Creating availability slots...');
    // Availability slots for all technicians
    await Promise.all([
        // Tech1 - Plumber
        prisma.availabilitySlot.create({
            data: {
                technicianId: tech1Profile.id,
                dayOfWeek: 1,
                startTime: '09:00',
                endTime: '17:00',
                isActive: true,
            },
        }),
        prisma.availabilitySlot.create({
            data: {
                technicianId: tech1Profile.id,
                dayOfWeek: 2,
                startTime: '09:00',
                endTime: '17:00',
                isActive: true,
            },
        }),
        prisma.availabilitySlot.create({
            data: {
                technicianId: tech1Profile.id,
                dayOfWeek: 3,
                startTime: '09:00',
                endTime: '17:00',
                isActive: true,
            },
        }),
        prisma.availabilitySlot.create({
            data: {
                technicianId: tech1Profile.id,
                dayOfWeek: 4,
                startTime: '09:00',
                endTime: '17:00',
                isActive: true,
            },
        }),
        prisma.availabilitySlot.create({
            data: {
                technicianId: tech1Profile.id,
                dayOfWeek: 5,
                startTime: '09:00',
                endTime: '17:00',
                isActive: true,
            },
        }),
        // Tech2 - Electrician
        prisma.availabilitySlot.create({
            data: {
                technicianId: tech2Profile.id,
                dayOfWeek: 1,
                startTime: '08:00',
                endTime: '16:00',
                isActive: true,
            },
        }),
        prisma.availabilitySlot.create({
            data: {
                technicianId: tech2Profile.id,
                dayOfWeek: 2,
                startTime: '08:00',
                endTime: '16:00',
                isActive: true,
            },
        }),
        prisma.availabilitySlot.create({
            data: {
                technicianId: tech2Profile.id,
                dayOfWeek: 3,
                startTime: '08:00',
                endTime: '16:00',
                isActive: true,
            },
        }),
        prisma.availabilitySlot.create({
            data: {
                technicianId: tech2Profile.id,
                dayOfWeek: 4,
                startTime: '08:00',
                endTime: '16:00',
                isActive: true,
            },
        }),
        // Tech3 - Cleaner
        prisma.availabilitySlot.create({
            data: {
                technicianId: tech3Profile.id,
                dayOfWeek: 1,
                startTime: '10:00',
                endTime: '18:00',
                isActive: true,
            },
        }),
        prisma.availabilitySlot.create({
            data: {
                technicianId: tech3Profile.id,
                dayOfWeek: 2,
                startTime: '10:00',
                endTime: '18:00',
                isActive: true,
            },
        }),
        prisma.availabilitySlot.create({
            data: {
                technicianId: tech3Profile.id,
                dayOfWeek: 3,
                startTime: '10:00',
                endTime: '18:00',
                isActive: true,
            },
        }),
        prisma.availabilitySlot.create({
            data: {
                technicianId: tech3Profile.id,
                dayOfWeek: 4,
                startTime: '10:00',
                endTime: '18:00',
                isActive: true,
            },
        }),
        prisma.availabilitySlot.create({
            data: {
                technicianId: tech3Profile.id,
                dayOfWeek: 5,
                startTime: '10:00',
                endTime: '18:00',
                isActive: true,
            },
        }),
        // Tech4 - Painter
        prisma.availabilitySlot.create({
            data: {
                technicianId: tech4Profile.id,
                dayOfWeek: 1,
                startTime: '09:00',
                endTime: '18:00',
                isActive: true,
            },
        }),
        prisma.availabilitySlot.create({
            data: {
                technicianId: tech4Profile.id,
                dayOfWeek: 2,
                startTime: '09:00',
                endTime: '18:00',
                isActive: true,
            },
        }),
        prisma.availabilitySlot.create({
            data: {
                technicianId: tech4Profile.id,
                dayOfWeek: 3,
                startTime: '09:00',
                endTime: '18:00',
                isActive: true,
            },
        }),
        prisma.availabilitySlot.create({
            data: {
                technicianId: tech4Profile.id,
                dayOfWeek: 4,
                startTime: '09:00',
                endTime: '18:00',
                isActive: true,
            },
        }),
        // Tech5 - HVAC
        prisma.availabilitySlot.create({
            data: {
                technicianId: tech5Profile.id,
                dayOfWeek: 1,
                startTime: '08:00',
                endTime: '17:00',
                isActive: true,
            },
        }),
        prisma.availabilitySlot.create({
            data: {
                technicianId: tech5Profile.id,
                dayOfWeek: 2,
                startTime: '08:00',
                endTime: '17:00',
                isActive: true,
            },
        }),
        prisma.availabilitySlot.create({
            data: {
                technicianId: tech5Profile.id,
                dayOfWeek: 3,
                startTime: '08:00',
                endTime: '17:00',
                isActive: true,
            },
        }),
        prisma.availabilitySlot.create({
            data: {
                technicianId: tech5Profile.id,
                dayOfWeek: 4,
                startTime: '08:00',
                endTime: '17:00',
                isActive: true,
            },
        }),
    ]);
    console.log('  ✅ Availability slots created');
    console.log('📋 Creating bookings...');
    // Existing bookings
    const booking1 = await prisma.booking.create({
        data: {
            customerId: customer1.id,
            technicianId: tech1Profile.id,
            serviceId: services[0].id,
            scheduledAt: new Date('2026-07-01T10:00:00.000Z'),
            status: BookingStatus.COMPLETED,
            totalAmount: services[0].price,
            notes: 'Please bring replacement parts',
        },
    });
    console.log(`  ✅ Booking 1 created (Completed)`);
    const booking2 = await prisma.booking.create({
        data: {
            customerId: customer2.id,
            technicianId: tech2Profile.id,
            serviceId: services[4].id,
            scheduledAt: new Date('2026-07-05T14:00:00.000Z'),
            status: BookingStatus.IN_PROGRESS,
            totalAmount: services[4].price,
            notes: 'Need to check wiring first',
        },
    });
    console.log(`  ✅ Booking 2 created (In Progress)`);
    const booking3 = await prisma.booking.create({
        data: {
            customerId: customer3.id,
            technicianId: tech3Profile.id,
            serviceId: services[8].id,
            scheduledAt: new Date('2026-07-10T09:00:00.000Z'),
            status: BookingStatus.PAID,
            totalAmount: services[8].price,
            notes: 'Please bring eco-friendly products',
        },
    });
    console.log(`  ✅ Booking 3 created (PAID)`);
    const booking4 = await prisma.booking.create({
        data: {
            customerId: customer1.id,
            technicianId: tech2Profile.id,
            serviceId: services[5].id,
            scheduledAt: new Date('2026-07-12T11:00:00.000Z'),
            status: BookingStatus.ACCEPTED,
            totalAmount: services[5].price,
            notes: 'Install 4 ceiling lights',
        },
    });
    console.log(`  ✅ Booking 4 created (ACCEPTED)`);
    const booking5 = await prisma.booking.create({
        data: {
            customerId: customer2.id,
            technicianId: tech1Profile.id,
            serviceId: services[2].id,
            scheduledAt: new Date('2026-07-15T15:00:00.000Z'),
            status: BookingStatus.REQUESTED,
            totalAmount: services[2].price,
            notes: 'Kitchen sink is clogged',
        },
    });
    console.log(`  ✅ Booking 5 created (REQUESTED)`);
    // ====== ADD MORE BOOKINGS ======
    const booking6 = await prisma.booking.create({
        data: {
            customerId: customer4.id,
            technicianId: tech4Profile.id,
            serviceId: services[11].id,
            scheduledAt: new Date('2026-07-18T10:00:00.000Z'),
            status: BookingStatus.COMPLETED,
            totalAmount: services[11].price,
            notes: 'Living room and bedroom painting',
        },
    });
    console.log(`  ✅ Booking 6 created (Completed)`);
    const booking7 = await prisma.booking.create({
        data: {
            customerId: customer5.id,
            technicianId: tech5Profile.id,
            serviceId: services[14].id,
            scheduledAt: new Date('2026-07-20T09:00:00.000Z'),
            status: BookingStatus.PAID,
            totalAmount: services[14].price,
            notes: 'Install new AC unit',
        },
    });
    console.log(`  ✅ Booking 7 created (PAID)`);
    const booking8 = await prisma.booking.create({
        data: {
            customerId: customer6.id,
            technicianId: tech1Profile.id,
            serviceId: services[3].id,
            scheduledAt: new Date('2026-07-22T14:00:00.000Z'),
            status: BookingStatus.ACCEPTED,
            totalAmount: services[3].price,
            notes: 'Water heater installation',
        },
    });
    console.log(`  ✅ Booking 8 created (ACCEPTED)`);
    const booking9 = await prisma.booking.create({
        data: {
            customerId: customer3.id,
            technicianId: tech4Profile.id,
            serviceId: services[12].id,
            scheduledAt: new Date('2026-07-25T08:00:00.000Z'),
            status: BookingStatus.REQUESTED,
            totalAmount: services[12].price,
            notes: 'Exterior painting needed',
        },
    });
    console.log(`  ✅ Booking 9 created (REQUESTED)`);
    const booking10 = await prisma.booking.create({
        data: {
            customerId: customer1.id,
            technicianId: tech5Profile.id,
            serviceId: services[15].id,
            scheduledAt: new Date('2026-07-28T11:00:00.000Z'),
            status: BookingStatus.ACCEPTED,
            totalAmount: services[15].price,
            notes: 'AC not cooling properly',
        },
    });
    console.log(`  ✅ Booking 10 created (ACCEPTED)`);
    console.log('💳 Creating payments...');
    // Existing payments
    await prisma.payment.create({
        data: {
            bookingId: booking1.id,
            userId: customer1.id,
            transactionId: `txn-${Date.now()}-001`,
            amount: booking1.totalAmount,
            method: 'card',
            provider: PaymentProvider.STRIPE,
            status: PaymentStatus.COMPLETED,
            paidAt: new Date('2026-07-01T10:30:00.000Z'),
        },
    });
    console.log('  ✅ Payment 1 created (Completed)');
    await prisma.payment.create({
        data: {
            bookingId: booking2.id,
            userId: customer2.id,
            transactionId: `txn-${Date.now()}-002`,
            amount: booking2.totalAmount,
            method: 'card',
            provider: PaymentProvider.STRIPE,
            status: PaymentStatus.COMPLETED,
            paidAt: new Date('2026-07-05T14:30:00.000Z'),
        },
    });
    console.log('  ✅ Payment 2 created (Completed)');
    await prisma.payment.create({
        data: {
            bookingId: booking3.id,
            userId: customer3.id,
            transactionId: `txn-${Date.now()}-003`,
            amount: booking3.totalAmount,
            method: 'card',
            provider: PaymentProvider.STRIPE,
            status: PaymentStatus.COMPLETED,
            paidAt: new Date('2026-07-08T10:00:00.000Z'),
        },
    });
    console.log('  ✅ Payment 3 created (Completed)');
    await prisma.payment.create({
        data: {
            bookingId: booking4.id,
            userId: customer1.id,
            transactionId: `txn-${Date.now()}-004`,
            amount: booking4.totalAmount,
            method: 'card',
            provider: PaymentProvider.STRIPE,
            status: PaymentStatus.PENDING,
            paidAt: null,
        },
    });
    console.log('  ✅ Payment 4 created (Pending)');
    // ====== ADD MORE PAYMENTS ======
    await prisma.payment.create({
        data: {
            bookingId: booking6.id,
            userId: customer4.id,
            transactionId: `txn-${Date.now()}-005`,
            amount: booking6.totalAmount,
            method: 'card',
            provider: PaymentProvider.STRIPE,
            status: PaymentStatus.COMPLETED,
            paidAt: new Date('2026-07-18T10:30:00.000Z'),
        },
    });
    console.log('  ✅ Payment 5 created (Completed)');
    await prisma.payment.create({
        data: {
            bookingId: booking7.id,
            userId: customer5.id,
            transactionId: `txn-${Date.now()}-006`,
            amount: booking7.totalAmount,
            method: 'card',
            provider: PaymentProvider.STRIPE,
            status: PaymentStatus.PENDING,
            paidAt: null,
        },
    });
    console.log('  ✅ Payment 6 created (Pending)');
    console.log('⭐ Creating reviews...');
    // Existing review
    await prisma.review.create({
        data: {
            bookingId: booking1.id,
            customerId: customer1.id,
            technicianId: tech1Profile.id,
            rating: 5,
            comment: 'Excellent service! John fixed the leak quickly and professionally.',
        },
    });
    console.log('  ✅ Review 1 created (5 stars)');
    // ====== ADD MORE REVIEWS ======
    await prisma.review.create({
        data: {
            bookingId: booking6.id,
            customerId: customer4.id,
            technicianId: tech4Profile.id,
            rating: 4,
            comment: 'Good painting work, but took a bit longer than expected.',
        },
    });
    console.log('  ✅ Review 2 created (4 stars)');
    await prisma.review.create({
        data: {
            bookingId: booking2.id,
            customerId: customer2.id,
            technicianId: tech2Profile.id,
            rating: 5,
            comment: 'Excellent electrical work! Very professional and clean.',
        },
    });
    console.log('  ✅ Review 3 created (5 stars)');
    console.log('\n🎉 Seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`  👤 Users: 1 Admin, 5 Technicians, 6 Customers`);
    console.log(`  📂 Categories: ${categories.length}`);
    console.log(`  🛠️ Services: ${services.length}`);
    console.log(`  📅 Bookings: 10 (2 Completed, 1 In Progress, 2 PAID, 3 ACCEPTED, 2 REQUESTED)`);
    console.log(`  💳 Payments: 6 (4 Completed, 2 Pending)`);
    console.log(`  ⭐ Reviews: 3`);
    console.log('\n📋 Login Credentials:');
    console.log('  🔑 Admin:   admin@fixitnow.com / admin123');
    console.log('  🔑 Tech 1:  tech1@fixitnow.com / tech123 (Plumber)');
    console.log('  🔑 Tech 2:  tech2@fixitnow.com / tech123 (Electrician)');
    console.log('  🔑 Tech 3:  tech3@fixitnow.com / tech123 (Cleaner)');
    console.log('  🔑 Tech 4:  tech4@fixitnow.com / tech123 (Painter)');
    console.log('  🔑 Tech 5:  tech5@fixitnow.com / tech123 (HVAC)');
    console.log('  🔑 Customer1: customer1@fixitnow.com / customer123');
    console.log('  🔑 Customer2: customer2@fixitnow.com / customer123');
    console.log('  🔑 Customer3: customer3@fixitnow.com / customer123');
    console.log('  🔑 Customer4: customer4@fixitnow.com / customer123');
    console.log('  🔑 Customer5: customer5@fixitnow.com / customer123');
    console.log('  🔑 Customer6: customer6@fixitnow.com / customer123');
    console.log('\n📋 Test Booking IDs:');
    console.log(`  Booking 1 (Completed): ${booking1.id}`);
    console.log(`  Booking 2 (In Progress): ${booking2.id}`);
    console.log(`  Booking 3 (PAID): ${booking3.id}`);
    console.log(`  Booking 4 (ACCEPTED): ${booking4.id}`);
    console.log(`  Booking 5 (REQUESTED): ${booking5.id}`);
    console.log(`  Booking 6 (Completed): ${booking6.id}`);
    console.log(`  Booking 7 (PAID): ${booking7.id}`);
    console.log(`  Booking 8 (ACCEPTED): ${booking8.id}`);
    console.log(`  Booking 9 (REQUESTED): ${booking9.id}`);
    console.log(`  Booking 10 (ACCEPTED): ${booking10.id}`);
}
main()
    .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map