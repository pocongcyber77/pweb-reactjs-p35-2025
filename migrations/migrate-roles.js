// Migration script untuk update RoleUser enum
// Jalankan dengan: node migrations/migrate-roles.js

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function migrateRoles() {
  try {
    console.log('🔄 Starting migration...');

    // Cek data yang ada
    const usersWithKasir = await prisma.$queryRaw`
      SELECT id_user, username, role 
      FROM "user" 
      WHERE role::text = 'Kasir'
    `;
    
    const usersWithManager = await prisma.$queryRaw`
      SELECT id_user, username, role 
      FROM "user" 
      WHERE role::text = 'Manager'
    `;

    console.log(`📊 Found ${usersWithKasir.length} users with role 'Kasir'`);
    console.log(`📊 Found ${usersWithManager.length} users with role 'Manager'`);

    if (usersWithKasir.length > 0 || usersWithManager.length > 0) {
      console.log('⚠️  WARNING: There are users with old roles that need migration!');
      console.log('   This script will update them to new roles.');
      console.log('   Kasir -> Admin');
      console.log('   Manager -> Admin');
      
      // Update Kasir to Admin
      if (usersWithKasir.length > 0) {
        await prisma.$executeRaw`
          UPDATE "user" 
          SET role = 'Admin'::text::role_user_enum 
          WHERE role::text = 'Kasir'
        `;
        console.log('✅ Updated Kasir users to Admin');
      }

      // Update Manager to Admin
      if (usersWithManager.length > 0) {
        await prisma.$executeRaw`
          UPDATE "user" 
          SET role = 'Admin'::text::role_user_enum 
          WHERE role::text = 'Manager'
        `;
        console.log('✅ Updated Manager users to Admin');
      }
    } else {
      console.log('✅ No users with old roles found. Safe to proceed.');
    }

    console.log('✅ Migration completed!');
    console.log('   Now you can run: npx prisma db push');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

migrateRoles();

