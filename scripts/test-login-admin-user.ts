// Script untuk test login dengan user dari admin panel
import { prisma } from '../src/prisma/client';
import { authService } from '../src/services/auth.service';
import * as adminSvc from '../src/services/id.service';

async function testLoginWithAdminUser() {
  try {
    console.log('🧪 Testing login with AdminUser from admin panel...\n');
    
    // Step 1: Create user via admin panel (AdminUser)
    console.log('1️⃣ Creating user via admin panel...');
    const testUser = {
      username: `test_login_${Date.now()}`,
      email: `test_login_${Date.now()}@test.com`,
      password: 'testpassword123',
      role: 'User' as const
    };
    
    const created = await adminSvc.createAdminUser(testUser);
    console.log('✅ User created via admin panel:', {
      id: created.id_user,
      username: created.username,
      email: created.email,
      role: created.role
    });
    
    // Step 2: Try to login with email
    console.log('\n2️⃣ Testing login with email...');
    try {
      const loginResult = await authService.login({
        emailOrUsername: testUser.email,
        password: testUser.password
      });
      console.log('✅ Login with email: SUCCESS');
      console.log('   User ID:', loginResult.user.id);
      console.log('   Email:', loginResult.user.email);
      console.log('   Username:', loginResult.user.username);
      console.log('   Token generated:', loginResult.token ? 'YES' : 'NO');
    } catch (error: any) {
      console.log('❌ Login with email: FAILED');
      console.log('   Error:', error.message);
      throw error;
    }
    
    // Step 3: Try to login with username
    console.log('\n3️⃣ Testing login with username...');
    try {
      const loginResult = await authService.login({
        emailOrUsername: testUser.username,
        password: testUser.password
      });
      console.log('✅ Login with username: SUCCESS');
      console.log('   User ID:', loginResult.user.id);
      console.log('   Email:', loginResult.user.email);
      console.log('   Username:', loginResult.user.username);
    } catch (error: any) {
      console.log('❌ Login with username: FAILED');
      console.log('   Error:', error.message);
      throw error;
    }
    
    // Step 4: Test wrong password
    console.log('\n4️⃣ Testing login with wrong password...');
    try {
      await authService.login({
        emailOrUsername: testUser.email,
        password: 'wrongpassword'
      });
      console.log('❌ Login with wrong password: Should have failed but succeeded');
    } catch (error: any) {
      if (error.message.includes('Invalid username/email or password')) {
        console.log('✅ Login with wrong password: Correctly rejected');
      } else {
        throw error;
      }
    }
    
    // Step 5: Cleanup - Delete test user
    console.log('\n5️⃣ Cleaning up test user...');
    await adminSvc.deleteAdminUser(created.id_user);
    console.log('✅ Test user deleted');
    
    console.log('\n🎉 All login tests passed!');
    console.log('\n✅ User created via admin panel can now login successfully!');
    
  } catch (error: any) {
    console.error('\n❌ Test failed:', error.message);
    console.error('Error details:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

testLoginWithAdminUser();

