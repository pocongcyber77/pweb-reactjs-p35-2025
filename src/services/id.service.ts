import bcrypt from 'bcrypt';
import { prisma } from '../prisma/client';
import { Prisma } from '@prisma/client';

export async function listBuku(params: { q?: string; condition?: string; sort?: string; page?: number; limit?: number }) {
	const { q, condition, sort, page = 1, limit = 10 } = params;
	const where: Prisma.BukuWhereInput = {
		AND: [
			q ? { judul: { contains: q, mode: 'insensitive' } } : {},
			condition ? { kondisi: condition as any } : {},
		],
	};
	const orderBy: Prisma.BukuOrderByWithRelationInput | undefined = sort === 'title' ? { judul: 'asc' } : sort === 'publication_year' ? { tahun_terbit: 'desc' } : undefined;
	const [items, total] = await Promise.all([
		prisma.buku.findMany({
			where,
			orderBy,
			skip: (page - 1) * limit,
			take: limit,
			include: { penulis: true, penerbit: true, kategori: true, genreRef: true, bahasa: true },
		}),
		prisma.buku.count({ where }),
	]);
	return { items, page, limit, total, totalPages: Math.max(1, Math.ceil(total / limit)) };
}

export async function getBuku(id_buku: number) {
	return prisma.buku.findUnique({ where: { id_buku }, include: { penulis: true, penerbit: true, kategori: true, genreRef: true, bahasa: true } });
}

export async function createBuku(data: any) {
	return prisma.buku.create({ data });
}

export async function deleteBuku(id_buku: number) {
	return prisma.buku.delete({ where: { id_buku } });
}

export async function listPenulis() {
	return prisma.penulis.findMany({ orderBy: { nama_penulis: 'asc' } });
}

export async function createPenulis(data: { nama_penulis: string; bio?: string }) {
	return prisma.penulis.create({ data });
}

export async function createTransaksi(payload: { id_pelanggan: number; metode_pembayaran?: string; items: { id_buku: number; jumlah: number }[] }) {
	const itemsWithPrice = await Promise.all(
		payload.items.map(async (it) => {
			const buku = await prisma.buku.findUnique({ where: { id_buku: it.id_buku } });
			if (!buku) throw new Error(`Buku ${it.id_buku} tidak ditemukan`);
			return { ...it, harga_satuan: buku.harga };
		})
	);
	const total = itemsWithPrice.reduce((acc, it) => acc + Number(it.harga_satuan) * it.jumlah, 0);
	return prisma.$transaction(async (tx) => {
		const trx = await tx.transaksi.create({
			data: {
				id_pelanggan: payload.id_pelanggan,
				total_harga: new Prisma.Decimal(total),
				metode_pembayaran: payload.metode_pembayaran,
				status: 'Pending',
			},
		});
		await tx.detailTransaksi.createMany({
			data: itemsWithPrice.map((it) => ({ id_transaksi: trx.id_transaksi, id_buku: it.id_buku, jumlah: it.jumlah, harga_satuan: it.harga_satuan })),
		});
		return tx.transaksi.findUnique({ where: { id_transaksi: trx.id_transaksi }, include: { detail: true } });
	});
}

export async function listTransaksi(params: { id_pelanggan?: number; q?: string; sort?: string; page?: number; limit?: number }) {
	const { id_pelanggan, q, sort, page = 1, limit = 10 } = params;
	const where: Prisma.TransaksiWhereInput = {
		AND: [
			id_pelanggan ? { id_pelanggan } : {},
			typeof q === 'string' && q.length ? { id_transaksi: Number.isNaN(Number(q)) ? undefined : Number(q) } : {},
		],
	};
	const orderBy: Prisma.TransaksiOrderByWithRelationInput | undefined = sort === 'id' ? { id_transaksi: 'asc' } : sort === 'price' ? { total_harga: 'desc' } : undefined;
	const [items, total] = await Promise.all([
		prisma.transaksi.findMany({ where, orderBy, skip: (page - 1) * limit, take: limit, include: { detail: true } }),
		prisma.transaksi.count({ where }),
	]);
	return { items, page, limit, total, totalPages: Math.max(1, Math.ceil(total / limit)) };
}

export async function getTransaksi(id_transaksi: number) {
	return prisma.transaksi.findUnique({ where: { id_transaksi }, include: { detail: { include: { buku: true } } } });
}

export async function listAdminUsers() {
	return prisma.adminUser.findMany({ orderBy: { username: 'asc' } });
}

export async function getAdminUserById(id_user: number) {
	return prisma.adminUser.findUnique({ where: { id_user } });
}

export async function createAdminUser(data: { username: string; email: string; password: string; role: 'User'|'Admin'|'Presiden'|'Dewa' }) {
	const saltRounds = 12;
	const hashedPassword = await bcrypt.hash(data.password, saltRounds);
	return prisma.adminUser.create({ 
		data: {
			...data,
			password: hashedPassword
		}
	});
}

export async function updateAdminUser(id_user: number, data: { username?: string; email?: string; password?: string; role?: 'User'|'Admin'|'Presiden'|'Dewa' }) {
	const updateData: any = { ...data };
	if (data.password) {
		const saltRounds = 12;
		updateData.password = await bcrypt.hash(data.password, saltRounds);
	}
	return prisma.adminUser.update({ where: { id_user }, data: updateData });
}

export async function deleteAdminUser(id_user: number) {
	return prisma.adminUser.delete({ where: { id_user } });
}

export async function listPelanggan(params?: { q?: string }) {
	const where: Prisma.PelangganWhereInput | undefined = params?.q ? { OR: [{ nama: { contains: params.q, mode: 'insensitive' } }, { email: { contains: params.q, mode: 'insensitive' } }] } : undefined;
	return prisma.pelanggan.findMany({ where, orderBy: { id_pelanggan: 'asc' } });
}

export async function listTransaksiByPelanggan(id_pelanggan: number) {
	return prisma.transaksi.findMany({ where: { id_pelanggan }, orderBy: { tanggal_transaksi: 'desc' }, include: { detail: true } });
}
