import { Request, Response } from 'express';
import * as svc from '../services/id.service';

export async function getBukuList(req: Request, res: Response) {
	const { q, condition, sort } = req.query as any;
	const page = Number(req.query.page) || 1;
	const limit = Number(req.query.limit) || 10;
	const data = await svc.listBuku({ q, condition, sort, page, limit });
	res.json({ success: true, message: 'OK', data });
}

export async function getBukuDetail(req: Request, res: Response) {
	const id = Number(req.params.id);
	const data = await svc.getBuku(id);
	if (!data) return res.status(404).json({ success: false, message: 'Buku tidak ditemukan' });
	res.json({ success: true, message: 'OK', data });
}

export async function postBuku(req: Request, res: Response) {
	const created = await svc.createBuku(req.body);
	res.status(201).json({ success: true, message: 'Buku dibuat', data: created });
}

export async function deleteBukuById(req: Request, res: Response) {
	const id = Number(req.params.id);
	await svc.deleteBuku(id);
	res.json({ success: true, message: 'Buku dihapus' });
}

export async function getPenulisList(_req: Request, res: Response) {
	const data = await svc.listPenulis();
	res.json({ success: true, message: 'OK', data });
}

export async function postPenulis(req: Request, res: Response) {
	const { nama_penulis, bio } = req.body;
	const created = await svc.createPenulis({ nama_penulis, bio });
	res.status(201).json({ success: true, message: 'Penulis dibuat', data: created });
}

export async function postTransaksi(req: Request, res: Response) {
	const t = await svc.createTransaksi(req.body);
	res.status(201).json({ success: true, message: 'Transaksi dibuat', data: t });
}

export async function getTransaksiList(req: Request, res: Response) {
	const { id_pelanggan, q, sort } = req.query as any;
	const page = Number(req.query.page) || 1;
	const limit = Number(req.query.limit) || 10;
	const data = await svc.listTransaksi({ id_pelanggan: id_pelanggan ? Number(id_pelanggan) : undefined, q, sort, page, limit });
	res.json({ success: true, message: 'OK', data });
}

export async function getTransaksiDetail(req: Request, res: Response) {
	const id = Number(req.params.id);
	const data = await svc.getTransaksi(id);
	if (!data) return res.status(404).json({ success: false, message: 'Transaksi tidak ditemukan' });
	res.json({ success: true, message: 'OK', data });
}

export async function getAdminUsers(_req: Request, res: Response) {
	const data = await svc.listAdminUsers();
	res.json({ success: true, message: 'OK', data });
}

export async function postAdminUser(req: Request, res: Response) {
	const { username, password, role } = req.body;
	const created = await svc.createAdminUser({ username, password, role });
	res.status(201).json({ success: true, message: 'User dibuat', data: created });
}

export async function getPelanggan(req: Request, res: Response) {
	const data = await svc.listPelanggan({ q: (req.query.q as string) || '' });
	res.json({ success: true, message: 'OK', data });
}

export async function getPelangganTransaksi(req: Request, res: Response) {
	const id = Number(req.params.id);
	const data = await svc.listTransaksiByPelanggan(id);
	res.json({ success: true, message: 'OK', data });
}
