import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function fix() {
  try {
    console.log('🔧 Fixing technician profiles...');

    // Find all technicians
    const allTechnicians = await prisma.user.findMany({
      where: { role: 'TECHNICIAN' },
      include: {
        technicianProfile: true,
      },
    });

    console.log(`📋 Total technicians: ${allTechnicians.length}`);

    let created = 0;
    let existing = 0;

    for (const tech of allTechnicians) {
      if (tech.technicianProfile) {
        existing++;
        continue;
      }

      await prisma.technicianProfile.create({
        data: {
          userId: tech.id,
          bio: null,
          experienceYrs: 0,
          location: null,
        },
      });
      created++;
      console.log(`✅ Profile created for: ${tech.email}`);
    }

    console.log(`\n📊 Summary:`);
    console.log(`  ✅ Existing profiles: ${existing}`);
    console.log(`  ✅ Created profiles: ${created}`);
    console.log(`  🎉 All technicians now have profiles!`);

    await prisma.$disconnect();
  } catch (error) {
    console.error('❌ Error:', error);
    await prisma.$disconnect();
  }
}

fix();
