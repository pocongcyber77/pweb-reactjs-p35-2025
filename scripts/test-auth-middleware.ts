// Script untuk test authentication middleware dengan AdminUser
import { prisma } from '../src/prisma/client';
import { authService } from '../src/services/auth.service';
import * as adminSvc from '../src/services/id.service';
import { generateToken, verifyToken } from '../src/utils/jwt';

async function testAuthMiddleware() {
  try {
    console.log('🧪 Testing authentication middleware with AdminUser...\n');
    
    // Step 1: Create user via admin panel
    console.log('1️⃣ Creating user via admin panel...');
    const testUser = {
      username: `test_auth_${Date.now()}`,
      email: `test_auth_${Date.now()}@test.com`,
      password: 'testpassword123',
      role: 'User' as const
    };
    
    const created = await adminSvc.createAdminUser(testUser);
    console.log('✅ User created:', {
      id: created.id_user,
      username: created.username,
      email: created.email
    });
    
    // Step 2: Login to get token
    console.log('\n2️⃣ Logging in to get token...');
    const loginResult = await authService.login({
      emailOrUsername: testUser.email,
      password: testUser.password
    });
    console.log('✅ Login successful');
    console.log('   Token:', loginResult.token.substring(0, 20) + '...');
    console.log('   User ID in token:', loginResult.user.id);
    
    // Step 3: Verify token
    console.log('\n3️⃣ Verifying token...');
    const decoded = verifyToken(loginResult.token);
    console.log('✅ Token decoded:', {
      userId: decoded.userId,
      email: decoded.email
    });
    
    // Step 4: Test finding user in User table (skip if not UUID)
    console.log('\n4️⃣ Testing find user in User table (users)...');
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(decoded.userId);
    if (isUUID) {
      const userInUsers = await prisma.user.findUnique({
        where: { id: decoded.userId },
      });
      console.log(`   Found in users table: ${userInUsers ? 'YES' : 'NO'}`);
    } else {
      console.log(`   Skipped (not UUID format, userId is numeric: ${decoded.userId})`);
    }
    
    // Step 5: Test finding user in AdminUser table
    console.log('\n5️⃣ Testing find user in AdminUser table (user)...');
    const userInAdmin = await prisma.adminUser.findUnique({
      where: { id_user: parseInt(decoded.userId) },
    });
    console.log(`   Found in user table: ${userInAdmin ? 'YES' : 'NO'}`);
    if (userInAdmin) {
      console.log('   AdminUser data:', {
        id_user: userInAdmin.id_user,
        username: userInAdmin.username,
        email: userInAdmin.email
      });
    }
    
    // Step 6: Test getProfile
    console.log('\n6️⃣ Testing getProfile...');
    const profile = await authService.getProfile(decoded.userId);
    console.log('✅ getProfile successful:', {
      id: profile.id,
      email: profile.email,
      username: profile.username
    });
    
    // Step 7: Cleanup
    console.log('\n7️⃣ Cleaning up...');
    await adminSvc.deleteAdminUser(created.id_user);
    console.log('✅ Test user deleted');
    
    console.log('\n🎉 All authentication tests passed!');
    console.log('\n✅ Middleware should now work correctly with AdminUser!');
    
  } catch (error: any) {
    console.error('\n❌ Test failed:', error.message);
    console.error('Error details:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

testAuthMiddleware();

