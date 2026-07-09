import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function verify() {
  try {
    const technicians = await prisma.user.findMany({
      where: { role: 'TECHNICIAN' },
      include: {
        technicianProfile: true,
      },
    });

    console.log('📋 Technicians:');
    
    if (technicians.length === 0) {
      console.log('❌ No technicians found in database');
      return;
    }

    technicians.forEach((tech) => {
      const hasProfile = tech.technicianProfile ? '✅' : '❌';
      console.log(`  ${hasProfile} ${tech.email}`);
    });

    await prisma.$disconnect();
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

verify();
