const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const prisma = new PrismaClient();

async function createAdmin() {
    const adminEmail = 'admin@cams.com';
    const plainPassword = 'adminpassword123';

    console.log('--- CAMS Admin Creation Tool ---');

    try {
        const hashedPassword = await bcrypt.hash(plainPassword, 10);

        // Using upsert to prevent unique constraint errors if record exists
        const admin = await prisma.user.upsert({
            where: { email: adminEmail },
            update: {
                passwordHash: hashedPassword,
                role: 'ADMIN',
            },
            create: {
                email: adminEmail,
                name: 'System Administrator',
                passwordHash: hashedPassword,
                role: 'ADMIN',
                // Note: Relationship fields are omitted (kept NULL) for Admin
            },
        });

        console.log('✅ Admin user created/updated successfully!');
        console.log(`Email: ${admin.email}`);
        console.log(`Password: ${plainPassword}`);
        console.log('You can now log in at http://localhost:3000/login');

    } catch (error) {
        console.error('❌ Error creating admin:', error);
    } finally {
        await prisma.$disconnect();
    }
}

createAdmin();
