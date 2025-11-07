import { useEffect, useState } from 'react';
import SeoHelmet from '../../components/layout/SeoHelmet';
import { api } from '../../utils/http';

interface OrderDto { id: string; total: number; created_at?: string }

export default function OrdersPage() {
	const [items, setItems] = useState<OrderDto[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [q, setQ] = useState('');
	const [sort, setSort] = useState('');
	const [page, setPage] = useState(1);
	const [limit, setLimit] = useState(10);
	const [totalPages, setTotalPages] = useState(1);

	useEffect(() => {
		setLoading(true);
		api
			.get('/transactions', { params: { q, sort, page, limit } })
			.then((res) => {
				const data = res.data?.data || res.data;
				if (data?.items && typeof data?.totalPages !== 'undefined') {
					setItems(data.items);
					setTotalPages(data.totalPages || 1);
				} else {
					const list = Array.isArray(data) ? data : data?.items ?? [];
					setItems(list);
					setTotalPages(1);
				}
			})
			.catch((e) => setError(e?.response?.data?.message || 'Gagal memuat transaksi'))
			.finally(() => setLoading(false));
	}, [q, sort, page, limit]);

	return (
		<div className="min-h-screen py-10 px-4">
			<SeoHelmet title="Pesanan Saya | IT Literature Store" description="Lihat daftar pesanan Anda dan statusnya." />
			<h1 className="text-3xl font-bold text-[#0588d9] mb-6">Pesanan Saya</h1>
			<div className="flex flex-wrap gap-3 mb-6 items-center">
				<input placeholder="Cari ID transaksi" value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} className="w-full sm:w-64 rounded-xl border px-3 py-2" />
				<select value={sort} onChange={(e) => { setSort(e.target.value); setPage(1); }} className="rounded-xl border px-3 py-2">
					<option value="">Urutkan</option>
					<option value="id">ID</option>
					<option value="price">Total</option>
				</select>
				<select value={limit} onChange={(e) => { setLimit(Number(e.target.value)); setPage(1); }} className="rounded-xl border px-3 py-2">
					<option value={5}>5</option>
					<option value={10}>10</option>
					<option value={20}>20</option>
				</select>
			</div>
			{loading && <div className="text-gray-500">Memuat...</div>}
			{error && <div className="text-red-600">{error}</div>}
			{!loading && !error && items.length === 0 && <div className="text-gray-600">Belum ada transaksi</div>}
			<ul className="space-y-3">
				{items.map((t: any) => (
					<li key={t.id} className="rounded-2xl bg-white/70 backdrop-blur-md shadow-glass p-4 border border-white/60 flex items-center justify-between">
						<div>
							<div className="font-semibold">ID: {t.id}</div>
							<div className="text-sm text-gray-600">Total: Rp {(t.total ?? t.total_harga)?.toLocaleString?.('id-ID') || t.total}</div>
							{(t.created_at || t.tanggal_transaksi) && (
								<div className="text-xs text-gray-500">{new Date(t.created_at || t.tanggal_transaksi).toLocaleString('id-ID')}</div>
							)}
						</div>
						<a className="text-[#0588d9]" href={`/me/orders/${t.id || t.id_transaksi}`}>Detail</a>
					</li>
				))}
			</ul>
			{totalPages > 1 && (
				<div className="mt-6 flex items-center gap-3">
					<button disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))} className="rounded-xl border px-3 py-2 disabled:opacity-50">Prev</button>
					<div className="text-sm">Hal {page} / {totalPages}</div>
					<button disabled={page >= totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))} className="rounded-xl border px-3 py-2 disabled:opacity-50">Next</button>
				</div>
			)}
		</div>
	);
}
