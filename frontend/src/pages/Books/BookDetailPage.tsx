import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SeoHelmet from '../../components/layout/SeoHelmet';
import { api } from '../../utils/http';
import Button from '../../components/ui/Button';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';

interface BookDto {
	id: string;
	title: string;
	writer: string;
	publisher?: string;
	price: number;
	stockQuantity: number;
	genre?: { id: string; name: string };
	coverUrl?: string;
	publicationYear?: number;
	description?: string;
	condition?: string;
}

export default function BookDetailPage() {
	const { id } = useParams();
	const navigate = useNavigate();
	const { token } = useAuth();
	const { add } = useCart();
	const [item, setItem] = useState<BookDto | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [deleting, setDeleting] = useState(false);

	useEffect(() => {
		if (!id) return;
		setLoading(true);
		api
			.get(`/books/${id}`)
			.then((res) => setItem(res.data?.data || res.data))
			.catch((e) => setError(e?.response?.data?.message || 'Gagal memuat detail buku'))
			.finally(() => setLoading(false));
	}, [id]);

	async function onDelete() {
		if (!id) return;
		if (!confirm('Yakin hapus buku ini?')) return;
		try {
			setDeleting(true);
			await api.delete(`/books/${id}`);
			alert('Buku dihapus');
			navigate('/books');
		} catch (e: any) {
			alert(e?.response?.data?.message || 'Gagal menghapus');
		} finally {
			setDeleting(false);
		}
	}

	function onAddToCart() {
		if (!item) return;
		add({ bookId: item.id, title: item.title, price: item.price, quantity: 1 });
		alert('Ditambahkan ke keranjang');
	}

	return (
		<div className="min-h-screen py-10 px-4">
			<SeoHelmet title="Detail Buku | IT Literature Store" description="Lihat detail buku IT, harga, stok, dan deskripsi." />
			<h1 className="text-3xl font-bold text-[#0588d9] mb-6">Detail Buku</h1>
			{loading && <div className="text-gray-500">Memuat...</div>}
			{error && <div className="text-red-600">{error}</div>}
			{!loading && !error && item && (
				<div className="rounded-2xl bg-white/70 backdrop-blur-md shadow-glass p-6 border border-white/60 space-y-4">
					{item.coverUrl && (
						<div className="w-full max-h-96 overflow-hidden rounded-2xl border border-white/60 bg-white">
							<img src={item.coverUrl} alt={`Cover ${item.title}`} className="w-full h-full object-cover" loading="lazy" />
						</div>
					)}
					<div className="text-2xl font-semibold">{item.title}</div>
					<div className="text-gray-600">{item.writer}{item.publisher ? ` · ${item.publisher}` : ''}</div>
					<div className="mt-3 text-[#0588d9] font-semibold">Rp {item.price?.toLocaleString('id-ID')}</div>
					<div className="text-sm text-gray-500">Stok: {item.stockQuantity}</div>
					{item.genre?.name && <div className="mt-2 inline-block text-xs px-2 py-1 bg-white/70 border border-white/60 rounded-xl">{item.genre.name}</div>}
					{item.publicationYear && <div className="text-sm text-gray-600">Tahun Terbit: {item.publicationYear}</div>}
					{item.condition && <div className="text-sm text-gray-600">Kondisi: {item.condition}</div>}
					{item.description && (
						<div className="mt-4 prose max-w-none text-gray-700">
							<ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
								{item.description}
							</ReactMarkdown>
						</div>
					)}
					<div className="pt-4 flex gap-3">
						<Button onClick={onAddToCart}>Tambah ke Keranjang</Button>
						<a href="/books" className="text-[#0588d9]">Kembali</a>
						{token && <Button variant="ghost" disabled={deleting} onClick={onDelete}>{deleting ? 'Menghapus...' : 'Hapus Buku'}</Button>}
					</div>
				</div>
			)}
		</div>
	);
}
