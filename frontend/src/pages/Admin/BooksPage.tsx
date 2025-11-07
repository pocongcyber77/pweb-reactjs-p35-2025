import { useEffect, useState } from 'react';
import SeoHelmet from '../../components/layout/SeoHelmet';
import { api } from '../../utils/http';

export default function BooksPage() {
	const [items, setItems] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [q, setQ] = useState('');

	useEffect(() => {
		setLoading(true);
		api.get('/books', { params: { q, limit: 100 } })
			.then((res) => setItems(res.data?.data?.items || res.data?.data || res.data?.items || res.data || []))
			.catch((e) => setError(e?.response?.data?.message || 'Gagal memuat buku'))
			.finally(() => setLoading(false));
	}, [q]);

	return (
		<div className="min-h-screen py-10 px-4">
			<SeoHelmet title="Mimin: Kelola Buku | IT Literature Store" description="Kelola katalog buku: tambah, ubah, dan hapus buku IT." />
			<div className="flex items-center justify-between mb-4">
				<h1 className="text-3xl font-bold text-[#0588d9]">Kelola Buku</h1>
				<a href="/mimin/books/new" className="rounded-xl bg-[#0588d9] text-white px-4 py-2">Tambah Buku</a>
			</div>
			<div className="mb-4"><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Cari judul/penulis" className="rounded-xl border px-3 py-2 w-full sm:w-72" /></div>
			{loading && <div className="text-gray-500">Memuat...</div>}
			{error && <div className="text-red-600">{error}</div>}
			<table className="w-full text-sm rounded-2xl overflow-hidden">
				<thead>
					<tr className="bg-white/70">
						<th className="text-left px-3 py-2">Judul</th>
						<th className="text-left px-3 py-2">Penulis</th>
						<th className="text-left px-3 py-2">Genre</th>
						<th className="text-left px-3 py-2">Harga</th>
						<th className="text-left px-3 py-2">Stok</th>
						<th className="text-left px-3 py-2">Aksi</th>
					</tr>
				</thead>
				<tbody>
					{items.map((b: any) => (
						<tr key={b.id || b.id_buku} className="border-t bg-white/50">
							<td className="px-3 py-2">{b.title || b.judul}</td>
							<td className="px-3 py-2">{b.writer || b.penulis?.nama_penulis || '-'}</td>
							<td className="px-3 py-2">{b.genre?.name || b.genreRef?.nama_genre || '-'}</td>
							<td className="px-3 py-2">Rp {(b.price ?? b.harga)?.toLocaleString?.('id-ID') || b.price}</td>
							<td className="px-3 py-2">{b.stockQuantity ?? b.stok ?? 0}</td>
							<td className="px-3 py-2"><a className="text-[#0588d9]" href={`/books/${b.id || b.id_buku}`}>Lihat</a></td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
