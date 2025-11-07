import { useEffect, useState } from 'react';
import SeoHelmet from '../../components/layout/SeoHelmet';
import { api } from '../../utils/http';

export default function AnalyticsPage() {
	const [count, setCount] = useState(0);
	const [total, setTotal] = useState(0);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		(async () => {
			try {
				setLoading(true);
				try {
					const s = await api.get('/transactions/statistics');
					setCount(Number(s.data?.data?.count || 0));
					setTotal(Number(s.data?.data?.totalAmount || 0));
				} catch {
					const r = await api.get('/transactions', { params: { limit: 200 } }).catch(() => api.get('/id/transaksi', { params: { limit: 200 } }));
					const list = r.data?.data?.items || r.data?.data || r.data?.items || r.data || [];
					setCount(Array.isArray(list) ? list.length : 0);
					setTotal(Array.isArray(list) ? list.reduce((s: number, t: any) => s + Number(t.total ?? t.total_harga ?? 0), 0) : 0);
				}
			} catch (e: any) {
				setError(e?.response?.data?.message || 'Gagal memuat analytics');
			} finally { setLoading(false); }
		})();
	}, []);

	return (
		<div className="min-h-screen py-10 px-4">
			<SeoHelmet title="Mimin: Analytics | IT Literature Store" description="Laporan penjualan dan statistik performa toko buku IT." />
			<h1 className="text-3xl font-bold text-[#0588d9] mb-6">Analytics</h1>
			{loading && <div className="text-gray-500">Memuat...</div>}
			{error && <div className="text-red-600">{error}</div>}
			{!loading && !error && (
				<>
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
						<div className="rounded-2xl bg-white/70 border border-white/60 p-4 shadow-glass"><div className="text-xs text-gray-500">Total Transaksi</div><div className="text-2xl font-semibold">{count}</div></div>
						<div className="rounded-2xl bg-white/70 border border-white/60 p-4 shadow-glass"><div className="text-xs text-gray-500">Total Pendapatan</div><div className="text-2xl font-semibold">Rp {total.toLocaleString('id-ID')}</div></div>
					</div>
					<div className="rounded-2xl bg-white/70 border border-white/60 p-4 shadow-glass min-h-[200px]">
						<div className="font-semibold mb-2">Chart Placeholder</div>
						<div className="text-sm text-gray-500">[Placeholder grafik trend penjualan]</div>
					</div>
				</>
			)}
		</div>
	);
}
