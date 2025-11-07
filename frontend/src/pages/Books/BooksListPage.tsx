import { useEffect, useState } from 'react';
import SeoHelmet from '../../components/layout/SeoHelmet';
import { api } from '../../utils/http';

interface BookDto {
	id: string;
	title: string;
	writer: string;
	price: number;
	stockQuantity: number;
	genre?: { id: string; name: string };
	condition?: string;
	coverUrl?: string;
}

export default function BooksListPage() {
	const [items, setItems] = useState<BookDto[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [q, setQ] = useState('');
	const [sort, setSort] = useState<'title' | 'publication_year' | ''>('');
	const [condition, setCondition] = useState('');
	const [page, setPage] = useState(1);
	const [limit, setLimit] = useState(9);
	const [totalPages, setTotalPages] = useState(1);

	useEffect(() => {
		setLoading(true);
		api
			.get('/books', { params: { q, sort, condition, page, limit } })
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
			.catch((e) => setError(e?.response?.data?.message || 'Gagal memuat buku'))
			.finally(() => setLoading(false));
	}, [q, sort, condition, page, limit]);

	return (
		<div className="min-h-screen py-10 px-4">
			<SeoHelmet title="Semua Buku | IT Literature Store" description="Temukan berbagai buku IT terbaik di toko kami." />
			<h1 className="text-3xl font-bold text-[#0588d9] mb-6">Semua Buku</h1>
			<div className="flex flex-wrap gap-3 mb-6 items-center">
				<input placeholder="Cari judul/penulis" value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} className="w-full sm:w-64 rounded-xl border px-3 py-2" />
				<select value={sort} onChange={(e) => { setSort(e.target.value as any); setPage(1); }} className="rounded-xl border px-3 py-2">
					<option value="">Urutkan</option>
					<option value="title">Judul</option>
					<option value="publication_year">Tahun Terbit</option>
				</select>
				<input placeholder="Kondisi (baru/bekas)" value={condition} onChange={(e) => { setCondition(e.target.value); setPage(1); }} className="w-full sm:w-56 rounded-xl border px-3 py-2" />
				<select value={limit} onChange={(e) => { setLimit(Number(e.target.value)); setPage(1); }} className="rounded-xl border px-3 py-2">
					<option value={6}>6</option>
					<option value={9}>9</option>
					<option value={12}>12</option>
				</select>
			</div>
			{loading && <div className="text-gray-500">Memuat...</div>}
			{error && <div className="text-red-600">{error}</div>}
			{!loading && !error && items.length === 0 && <div className="text-gray-600">Tidak ada buku</div>}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
				{items.map((b) => (
					<a key={b.id} href={`/books/${b.id}`} className="rounded-2xl bg-white/70 backdrop-blur-md shadow-glass p-4 border border-white/60 space-y-3">
						{b.coverUrl && (
							<div className="w-full h-48 overflow-hidden rounded-xl border border-white/60 bg-white">
								<img src={b.coverUrl} alt={`Cover ${b.title}`} className="w-full h-full object-cover" loading="lazy" />
							</div>
						)}
						<div className="font-semibold">{b.title}</div>
						<div className="text-sm text-gray-600">{b.writer}</div>
						<div className="mt-2 text-[#0588d9] font-semibold">Rp {b.price?.toLocaleString('id-ID')}</div>
						<div className="text-xs text-gray-500">Stok: {b.stockQuantity}</div>
						{b.genre && <div className="mt-2 inline-block text-xs px-2 py-1 bg-white/70 border border-white/60 rounded-xl">{b.genre.name}</div>}
						{b.condition && <div className="text-xs text-gray-500 mt-1">Kondisi: {b.condition}</div>}
					</a>
				))}
			</div>
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
