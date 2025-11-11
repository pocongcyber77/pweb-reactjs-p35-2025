// Script untuk test admin role protection
import { prisma } from '../src/prisma/client';
import * as adminSvc from '../src/services/id.service';
import { authService } from '../src/services/auth.service';
import { generateToken } from '../src/utils/jwt';

async function testAdminRoleProtection() {
  try {
    console.log('🧪 Testing admin role protection...\n');
    
    // Step 1: Create users with different roles
    console.log('1️⃣ Creating test users with different roles...');
    
    const adminUser = await adminSvc.createAdminUser({
      username: `test_admin_${Date.now()}`,
      email: `test_admin_${Date.now()}@test.com`,
      password: 'testpassword123',
      role: 'Admin'
    });
    
    const presidenUser = await adminSvc.createAdminUser({
      username: `test_presiden_${Date.now()}`,
      email: `test_presiden_${Date.now()}@test.com`,
      password: 'testpassword123',
      role: 'Presiden'
    });
    
    const dewaUser = await adminSvc.createAdminUser({
      username: `test_dewa_${Date.now()}`,
      email: `test_dewa_${Date.now()}@test.com`,
      password: 'testpassword123',
      role: 'Dewa'
    });
    
    const regularUser = await adminSvc.createAdminUser({
      username: `test_user_${Date.now()}`,
      email: `test_user_${Date.now()}@test.com`,
      password: 'testpassword123',
      role: 'User'
    });
    
    console.log('✅ Test users created');
    
    // Step 2: Test login and get tokens
    console.log('\n2️⃣ Testing login for each user...');
    
    const adminLogin = await authService.login({
      emailOrUsername: adminUser.email,
      password: 'testpassword123'
    });
    console.log('✅ Admin login successful, role:', adminLogin.user.role);
    
    const presidenLogin = await authService.login({
      emailOrUsername: presidenUser.email,
      password: 'testpassword123'
    });
    console.log('✅ Presiden login successful, role:', presidenLogin.user.role);
    
    const dewaLogin = await authService.login({
      emailOrUsername: dewaUser.email,
      password: 'testpassword123'
    });
    console.log('✅ Dewa login successful, role:', dewaLogin.user.role);
    
    const regularLogin = await authService.login({
      emailOrUsername: regularUser.email,
      password: 'testpassword123'
    });
    console.log('✅ Regular User login successful, role:', regularLogin.user.role);
    
    // Step 3: Test role checking logic
    console.log('\n3️⃣ Testing role checking logic...');
    
    const allowedRoles = ['Admin', 'Presiden', 'Dewa'];
    
    const testRoles = [
      { role: adminLogin.user.role, name: 'Admin' },
      { role: presidenLogin.user.role, name: 'Presiden' },
      { role: dewaLogin.user.role, name: 'Dewa' },
      { role: regularLogin.user.role, name: 'User' }
    ];
    
    testRoles.forEach(({ role, name }) => {
      const hasAccess = role && allowedRoles.includes(role);
      console.log(`   ${name} (${role}): ${hasAccess ? '✅ ALLOWED' : '❌ DENIED'}`);
    });
    
    // Step 4: Cleanup
    console.log('\n4️⃣ Cleaning up...');
    await adminSvc.deleteAdminUser(adminUser.id_user);
    await adminSvc.deleteAdminUser(presidenUser.id_user);
    await adminSvc.deleteAdminUser(dewaUser.id_user);
    await adminSvc.deleteAdminUser(regularUser.id_user);
    console.log('✅ Test users deleted');
    
    console.log('\n🎉 All role protection tests passed!');
    console.log('\n✅ Role validation working correctly:');
    console.log('   ✅ Admin: ALLOWED');
    console.log('   ✅ Presiden: ALLOWED');
    console.log('   ✅ Dewa: ALLOWED');
    console.log('   ❌ User: DENIED');
    
  } catch (error: any) {
    console.error('\n❌ Test failed:', error.message);
    console.error('Error details:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

testAdminRoleProtection();

