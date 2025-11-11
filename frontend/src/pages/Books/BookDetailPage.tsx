import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SeoHelmet from '../../components/layout/SeoHelmet';
import { api } from '../../utils/http';
import Button from '../../components/ui/Button';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import { useFavorite } from '../../hooks/useFavorite';
import { useLoginModal } from '../../contexts/LoginModalContext';
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
	const { openModal } = useLoginModal();
	const { isFavorited, toggleFavorite, loading: favoriteLoading } = useFavorite(id);
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
		if (!token) {
			openModal();
			return;
		}
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
				<div className="rounded-2xl bg-white/70 backdrop-blur-md shadow-glass p-6 border border-white/60 space-y-6">
					<div className="flex flex-col md:flex-row gap-6">
						{item.coverUrl && (
							<div className="shrink-0 relative">
								<button
									onClick={toggleFavorite}
									disabled={favoriteLoading}
									className="absolute top-2 right-2 z-10 p-2 rounded-full bg-white/80 backdrop-blur-sm shadow-md hover:bg-white transition-colors disabled:opacity-50"
									title={isFavorited ? 'Hapus dari favorit' : 'Tambah ke favorit'}
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className={`w-6 h-6 transition-colors ${isFavorited ? 'text-[#0588d9] fill-[#0588d9]' : 'text-gray-400'}`}
										viewBox="0 0 24 24"
										stroke="currentColor"
										strokeWidth="2"
										fill={isFavorited ? 'currentColor' : 'none'}
									>
										<path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
									</svg>
								</button>
								<div className="overflow-hidden rounded-lg border-4 border-gray-400 bg-white shadow-2xl" style={{ aspectRatio: '148/210', width: 'min(300px, 100%)', maxWidth: '300px' }}>
									<img src={item.coverUrl} alt={`Cover ${item.title}`} className="w-full h-full object-cover" loading="lazy" />
								</div>
							</div>
						)}
						<div className="flex-1 flex flex-col">
							<div className="text-2xl font-semibold mb-2 font-heading">{item.title}</div>
							<div className="text-gray-600 mb-3">{item.writer}{item.publisher ? ` · ${item.publisher}` : ''}</div>
							<div className="text-xl text-[#0588d9] font-semibold mb-2">Rp {item.price?.toLocaleString('id-ID')}</div>
							<div className="text-sm text-gray-500 mb-2">Stok: {item.stockQuantity}</div>
							{item.genre?.name && <div className="mt-2 inline-block text-xs px-2 py-1 bg-white/70 border border-white/60 rounded-xl w-fit mb-2">{item.genre.name}</div>}
							{item.publicationYear && <div className="text-sm text-gray-600 mb-1">Tahun Terbit: {item.publicationYear}</div>}
							{item.condition && <div className="text-sm text-gray-600 mb-4">Kondisi: {item.condition}</div>}
							<div className="pt-4 flex flex-wrap gap-3">
								<Button onClick={onAddToCart}>Tambah ke Keranjang</Button>
								<a href="/books" className="text-[#0588d9] hover:underline">Kembali</a>
								{token && <Button variant="ghost" disabled={deleting} onClick={onDelete}>{deleting ? 'Menghapus...' : 'Hapus Buku'}</Button>}
							</div>
						</div>
					</div>
					{item.description && (
						<div className="mt-4 prose max-w-none text-gray-700">
							<ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
								{item.description}
							</ReactMarkdown>
						</div>
					)}
				</div>
			)}
		</div>
	);
}
