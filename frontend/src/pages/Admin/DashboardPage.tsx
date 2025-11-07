import { useEffect, useState } from 'react';
import SeoHelmet from '../../components/layout/SeoHelmet';
import { api } from '../../utils/http';

interface Book { id?: string; title?: string; judul?: string; stockQuantity?: number; stok?: number; price?: number; harga?: number; genre?: any; genreRef?: any }

export default function DashboardPage() {
	const [books, setBooks] = useState<Book[]>([]);
	const [trxTotal, setTrxTotal] = useState<number>(0);
	const [trxCount, setTrxCount] = useState<number>(0);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		(async () => {
			try {
				setLoading(true);
				// Books summary
				const br = await api.get('/books', { params: { limit: 100 } }).catch(() => api.get('/id/buku', { params: { limit: 100 } }));
				const bData = br.data?.data?.items || br.data?.data || br.data?.items || br.data || [];
				setBooks(Array.isArray(bData) ? bData : []);
				// Transactions statistics
				try {
					const sr = await api.get('/transactions/statistics');
					setTrxTotal(Number(sr.data?.data?.totalAmount || 0));
					setTrxCount(Number(sr.data?.data?.count || 0));
				} catch {
					const tr = await api.get('/transactions', { params: { limit: 100 } }).catch(() => api.get('/id/transaksi', { params: { limit: 100 } }));
					const tData = tr.data?.data?.items || tr.data?.data || tr.data?.items || tr.data || [];
					const list = Array.isArray(tData) ? tData : [];
					setTrxCount(list.length);
					setTrxTotal(list.reduce((s: number, t: any) => s + Number(t.total ?? t.total_harga ?? 0), 0));
				}
			} catch (e: any) {
				setError(e?.response?.data?.message || 'Gagal memuat ringkasan');
			} finally {
				setLoading(false);
			}
		})();
	}, []);

	const totalBooks = books.length;
	const lowStock = books.filter((b) => (b.stockQuantity ?? b.stok ?? 0) < 5).length;
	const topBooks = books.slice(0, 5);

	return (
		<div className="min-h-screen py-10 px-4">
			<SeoHelmet title="Mimin: Dashboard | IT Literature Store" description="Ringkasan metrik dan aktivitas toko buku IT Anda." />
			<h1 className="text-3xl font-bold text-[#0588d9] mb-6">Dashboard</h1>
			{loading && <div className="text-gray-500">Memuat...</div>}
			{error && <div className="text-red-600">{error}</div>}
			{!loading && !error && (
				<>
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
						<div className="rounded-2xl bg-white/70 border border-white/60 p-4 shadow-glass"><div className="text-xs text-gray-500">Total Buku</div><div className="text-2xl font-semibold">{totalBooks}</div></div>
						<div className="rounded-2xl bg-white/70 border border-white/60 p-4 shadow-glass"><div className="text-xs text-gray-500">Stok Rendah (&lt;5)</div><div className="text-2xl font-semibold">{lowStock}</div></div>
						<div className="rounded-2xl bg-white/70 border border-white/60 p-4 shadow-glass"><div className="text-xs text-gray-500">Total Transaksi</div><div className="text-2xl font-semibold">{trxCount}</div></div>
						<div className="rounded-2xl bg-white/70 border border-white/60 p-4 shadow-glass"><div className="text-xs text-gray-500">Pendapatan</div><div className="text-2xl font-semibold">Rp {trxTotal.toLocaleString('id-ID')}</div></div>
					</div>
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
						<div className="rounded-2xl bg-white/70 border border-white/60 p-4 shadow-glass">
							<div className="font-semibold mb-2">Buku Terbaru</div>
							<ul className="text-sm space-y-1">
								{topBooks.map((b, i) => (
									<li key={i} className="flex items-center justify-between"><span>{b.title || b.judul}</span><span className="text-gray-500 text-xs">Stok {(b.stockQuantity ?? b.stok ?? 0)}</span></li>
								))}
							</ul>
						</div>
						<div className="rounded-2xl bg-white/70 border border-white/60 p-4 shadow-glass min-h-[160px]">
							<div className="font-semibold mb-2">Aktivitas Terkini</div>
							<div className="text-sm text-gray-500">[Placeholder grafik sederhana atau daftar transaksi]</div>
						</div>
					</div>
				</>
			)}
		</div>
	);
}
