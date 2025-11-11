import { prisma } from '../src/prisma/client';
import { createAdminUser } from '../src/services/id.service';

async function main() {
	try {
		const username = process.env.ADMIN_USERNAME || 'admin';
		const email = process.env.ADMIN_EMAIL || 'admin@example.com';
		const password = process.env.ADMIN_PASSWORD || 'password123';
		const role = (process.env.ADMIN_ROLE as any) || 'Admin';

		console.log('Creating admin user...');
		const created = await createAdminUser({ username, email, password, role });
		console.log('✅ Admin user created:', {
			id_user: created.id_user,
			username: created.username,
			email: created.email,
			role: created.role,
		});
	} catch (err: any) {
		console.error('❌ Failed to create admin user:', err?.message || err);
		process.exit(1);
	} finally {
		await prisma.$disconnect();
	}
}

main();


