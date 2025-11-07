import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import SeoHelmet from '../../components/layout/SeoHelmet';
import { api } from '../../utils/http';

export default function OrderDetailPage() {
	const { id } = useParams();
	const [item, setItem] = useState<any>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (!id) return;
		setLoading(true);
		api
			.get(`/transactions/${id}`)
			.then((res) => setItem(res.data?.data || res.data))
			.catch((e) => setError(e?.response?.data?.message || 'Gagal memuat detail transaksi'))
			.finally(() => setLoading(false));
	}, [id]);

	return (
		<div className="min-h-screen py-10 px-4">
			<SeoHelmet title="Detail Pesanan | IT Literature Store" description="Detail pesanan Anda termasuk item, total, dan status." />
			<h1 className="text-3xl font-bold text-[#0588d9] mb-6">Detail Pesanan</h1>
			{loading && <div className="text-gray-500">Memuat...</div>}
			{error && <div className="text-red-600">{error}</div>}
			{!loading && !error && item && (
				<div className="rounded-2xl bg-white/70 backdrop-blur-md shadow-glass p-6 border border-white/60 space-y-3">
					<div className="font-semibold">ID: {item.id || item.id_transaksi}</div>
					<div className="text-gray-700">Total: Rp {(item.total ?? item.total_harga)?.toLocaleString?.('id-ID') || item.total}</div>
					{(item.created_at || item.tanggal_transaksi) && (
						<div className="text-sm text-gray-500">{new Date(item.created_at || item.tanggal_transaksi).toLocaleString('id-ID')}</div>
					)}
					<div>
						<h2 className="font-semibold mb-2">Items</h2>
						<ul className="list-disc pl-6 text-gray-700">
							{(item.items || item.detail)?.map((it: any) => (
								<li key={it.id || it.id_detail}>{it.book?.title || it.buku?.judul} × {it.quantity || it.jumlah}</li>
							))}
						</ul>
					</div>
				</div>
			)}
		</div>
	);
}
