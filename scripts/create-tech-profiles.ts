import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function createProfiles() {
  try {
    console.log('🔍 Finding technicians without profiles...');

    const technicians = await prisma.user.findMany({
      where: {
        role: 'TECHNICIAN',
        technicianProfile: null,
      },
    });

    console.log(`📋 Found ${technicians.length} technicians without profiles`);

    if (technicians.length === 0) {
      console.log('✅ All technicians have profiles!');
      return;
    }

    for (const tech of technicians) {
      await prisma.technicianProfile.create({
        data: {
          userId: tech.id,
          bio: null,
          experienceYrs: 0,
          location: null,
        },
      });
      console.log(`✅ Profile created for: ${tech.email}`);
    }

    console.log('🎉 All profiles created successfully!');
  } catch (error) {
    console.error('❌ Error creating profiles:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createProfiles();
