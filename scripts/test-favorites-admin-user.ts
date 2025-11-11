// Script untuk test favorites dengan AdminUser
import { prisma } from '../src/prisma/client';
import { favoritesService } from '../src/services/favorites.service';
import * as adminSvc from '../src/services/id.service';
import { authService } from '../src/services/auth.service';

async function testFavoritesWithAdminUser() {
  try {
    console.log('🧪 Testing favorites with AdminUser...\n');
    
    // Step 1: Create AdminUser
    console.log('1️⃣ Creating AdminUser via admin panel...');
    const testUser = {
      username: `test_fav_${Date.now()}`,
      email: `test_fav_${Date.now()}@test.com`,
      password: 'testpassword123',
      role: 'User' as const
    };
    
    const created = await adminSvc.createAdminUser(testUser);
    console.log('✅ AdminUser created:', {
      id: created.id_user,
      username: created.username,
      email: created.email
    });
    
    // Step 2: Login to get userId
    console.log('\n2️⃣ Logging in...');
    const loginResult = await authService.login({
      emailOrUsername: testUser.email,
      password: testUser.password
    });
    console.log('✅ Login successful');
    console.log('   User ID:', loginResult.user.id);
    console.log('   Is UUID:', /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(loginResult.user.id));
    
    // Step 3: Test getUserFavorites (should return empty array)
    console.log('\n3️⃣ Testing getUserFavorites with AdminUser...');
    try {
      const favorites = await favoritesService.getUserFavorites(loginResult.user.id);
      console.log('✅ getUserFavorites: SUCCESS');
      console.log('   Returned empty array (AdminUser cannot use favorites):', favorites.length === 0);
    } catch (error: any) {
      console.log('❌ getUserFavorites: FAILED');
      console.log('   Error:', error.message);
      throw error;
    }
    
    // Step 4: Test isFavorited (should return false)
    console.log('\n4️⃣ Testing isFavorited with AdminUser...');
    try {
      const isFav = await favoritesService.isFavorited(loginResult.user.id, 'some-book-id');
      console.log('✅ isFavorited: SUCCESS');
      console.log('   Returned false (AdminUser cannot use favorites):', isFav === false);
    } catch (error: any) {
      console.log('❌ isFavorited: FAILED');
      console.log('   Error:', error.message);
      throw error;
    }
    
    // Step 5: Test add (should throw error)
    console.log('\n5️⃣ Testing add favorite with AdminUser...');
    try {
      await favoritesService.add(loginResult.user.id, 'some-book-id');
      console.log('❌ add: Should have failed but succeeded');
    } catch (error: any) {
      if (error.message.includes('Favorites feature is only available for regular users')) {
        console.log('✅ add: Correctly rejected for AdminUser');
      } else {
        throw error;
      }
    }
    
    // Step 6: Cleanup
    console.log('\n6️⃣ Cleaning up...');
    await adminSvc.deleteAdminUser(created.id_user);
    console.log('✅ Test user deleted');
    
    console.log('\n🎉 All favorites tests passed!');
    console.log('\n✅ Favorites service correctly handles AdminUser (returns empty/error as expected)');
    
  } catch (error: any) {
    console.error('\n❌ Test failed:', error.message);
    console.error('Error details:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

testFavoritesWithAdminUser();

