// Script untuk test koneksi database dan operasi CRUD
import { prisma } from '../src/prisma/client';

async function testConnection() {
  try {
    console.log('🔌 Testing database connection...');
    
    // Test 1: Koneksi database
    await prisma.$connect();
    console.log('✅ Database connected successfully');
    
    // Test 2: Query sederhana
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    console.log('✅ Database query test passed:', result);
    
    // Test 3: Cek table user
    const userCount = await prisma.adminUser.count();
    console.log(`✅ AdminUser table accessible. Total users: ${userCount}`);
    
    // Test 4: List users
    const users = await prisma.adminUser.findMany({ take: 5 });
    console.log(`✅ Can read users. Sample users:`, users.length);
    
    console.log('\n🎉 All database tests passed!');
    
  } catch (error: any) {
    console.error('❌ Database connection test failed:', error.message);
    console.error('Error details:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();

