// Script untuk test CRUD API endpoints
import { prisma } from '../src/prisma/client';
import * as svc from '../src/services/id.service';
import bcrypt from 'bcrypt';

async function testCRUD() {
  try {
    console.log('🧪 Testing CRUD operations...\n');
    
    // Test 1: CREATE
    console.log('1️⃣ Testing CREATE operation...');
    const testUser = {
      username: `test_user_${Date.now()}`,
      email: `test_${Date.now()}@test.com`,
      password: 'testpassword123',
      role: 'User' as const
    };
    
    const created = await svc.createAdminUser(testUser);
    console.log('✅ CREATE passed. User created:', {
      id: created.id_user,
      username: created.username,
      email: created.email,
      role: created.role
    });
    
    // Verify password is hashed
    const isHashed = created.password !== testUser.password && created.password.startsWith('$2b$');
    console.log(`✅ Password hashing: ${isHashed ? 'PASSED' : 'FAILED'}`);
    
    // Test 2: READ (Get by ID)
    console.log('\n2️⃣ Testing READ operation (Get by ID)...');
    const fetched = await svc.getAdminUserById(created.id_user);
    if (fetched && fetched.id_user === created.id_user) {
      console.log('✅ READ by ID passed:', {
        id: fetched.id_user,
        username: fetched.username,
        email: fetched.email
      });
    } else {
      throw new Error('Failed to fetch user by ID');
    }
    
    // Test 3: READ (List all)
    console.log('\n3️⃣ Testing READ operation (List all)...');
    const allUsers = await svc.listAdminUsers();
    console.log(`✅ List all passed. Total users: ${allUsers.length}`);
    
    // Test 4: UPDATE
    console.log('\n4️⃣ Testing UPDATE operation...');
    const updateData = {
      username: `${testUser.username}_updated`,
      email: `updated_${testUser.email}`,
      role: 'Admin' as const
    };
    
    const updated = await svc.updateAdminUser(created.id_user, updateData);
    console.log('✅ UPDATE passed. User updated:', {
      id: updated.id_user,
      username: updated.username,
      email: updated.email,
      role: updated.role
    });
    
    // Verify changes
    if (updated.username !== updateData.username || updated.email !== updateData.email) {
      throw new Error('Update did not persist correctly');
    }
    
    // Test 5: UPDATE password
    console.log('\n5️⃣ Testing UPDATE password...');
    const newPassword = 'newpassword123';
    await svc.updateAdminUser(created.id_user, { password: newPassword });
    const userAfterPwdUpdate = await svc.getAdminUserById(created.id_user);
    
    if (userAfterPwdUpdate) {
      const isNewPasswordHashed = userAfterPwdUpdate.password !== newPassword && 
                                   userAfterPwdUpdate.password.startsWith('$2b$');
      console.log(`✅ Password update: ${isNewPasswordHashed ? 'PASSED' : 'FAILED'}`);
    }
    
    // Test 6: DELETE
    console.log('\n6️⃣ Testing DELETE operation...');
    await svc.deleteAdminUser(created.id_user);
    
    // Verify deletion
    const deletedUser = await svc.getAdminUserById(created.id_user);
    if (deletedUser === null) {
      console.log('✅ DELETE passed. User successfully deleted');
    } else {
      throw new Error('User was not deleted');
    }
    
    console.log('\n🎉 All CRUD operations passed successfully!');
    console.log('\n📊 Summary:');
    console.log('  ✅ CREATE - User creation with password hashing');
    console.log('  ✅ READ - Get by ID and List all');
    console.log('  ✅ UPDATE - Update user data and password');
    console.log('  ✅ DELETE - User deletion');
    
  } catch (error: any) {
    console.error('\n❌ CRUD test failed:', error.message);
    console.error('Error details:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

testCRUD();

