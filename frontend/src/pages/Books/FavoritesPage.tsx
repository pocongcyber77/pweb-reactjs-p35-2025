import { useEffect, useState, useCallback } from 'react';
import SeoHelmet from '../../components/layout/SeoHelmet';
import { api } from '../../utils/http';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useFavorite } from '../../hooks/useFavorite';

interface BookDto {
	id: string;
	title: string;
	writer: string;
	publisher?: string;
	price: number;
	stockQuantity: number;
	genre?: { id: string; name: string };
	condition?: string;
	coverUrl?: string;
	publicationYear?: number;
}

export default function FavoritesPage() {
	const { token } = useAuth();
	const navigate = useNavigate();
	const [items, setItems] = useState<BookDto[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [refreshKey, setRefreshKey] = useState(0);

	const fetchFavorites = useCallback(() => {
		if (!token) {
			navigate('/auth/login');
			return;
		}

		setLoading(true);
		setError(null);
		api
			.get('/favorites', {
				headers: { Authorization: `Bearer ${token}` },
			})
			.then((res) => {
				const favorites = res.data?.data || [];
				const books = favorites.map((f: any) => {
					const book = f.book || f;
					return {
						id: book.id,
						title: book.title,
						writer: book.writer,
						publisher: book.publisher,
						price: book.price ? Number(book.price) : book.price,
						stockQuantity: book.stock_quantity || book.stockQuantity,
						genre: book.genre,
						condition: book.condition,
						coverUrl: book.cover_url || book.coverUrl,
						publicationYear: book.publication_year || book.publicationYear,
					};
				});
				setItems(books);
			})
			.catch((e) => {
				const errorMsg = e?.response?.data?.error || e?.response?.data?.message || 'Gagal memuat favorit';
				setError(errorMsg);
			})
			.finally(() => setLoading(false));
	}, [token, navigate]);

	useEffect(() => {
		fetchFavorites();
	}, [fetchFavorites, refreshKey]);

	function BookCard({ book: b }: { book: BookDto }) {
		const { isFavorited, toggleFavorite, loading } = useFavorite(b.id);

		const handleToggle = async (e: React.MouseEvent) => {
			e.preventDefault();
			e.stopPropagation();
			await toggleFavorite();
			// Refresh list after toggle
			setRefreshKey((k) => k + 1);
		};

		return (
			<div className="rounded-2xl bg-white/70 backdrop-blur-md shadow-glass p-4 border border-white/60 flex flex-col overflow-hidden w-full relative transition-all duration-300 ease-out hover:scale-[1.03] hover:-translate-y-2 hover:shadow-2xl cursor-pointer" style={{ aspectRatio: '10/16' }}>
				<button
					onClick={handleToggle}
					disabled={loading}
					className="absolute top-2 right-2 z-10 p-2 rounded-full bg-white/80 backdrop-blur-sm shadow-md hover:bg-white transition-colors disabled:opacity-50"
					title={isFavorited ? 'Hapus dari favorit' : 'Tambah ke favorit'}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						className={`w-5 h-5 transition-colors ${isFavorited ? 'text-[#0588d9] fill-[#0588d9]' : 'text-gray-400'}`}
						viewBox="0 0 24 24"
						stroke="currentColor"
						strokeWidth="2"
						fill={isFavorited ? 'currentColor' : 'none'}
					>
						<path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
					</svg>
				</button>
				<a href={`/books/${b.id}`} className="flex flex-col flex-1">
					{b.coverUrl ? (
						<div className="w-full flex justify-center mb-4">
							<div className="overflow-hidden rounded-lg border-2 border-gray-300 bg-white shadow-md transition-transform duration-300 hover:scale-105" style={{ aspectRatio: '148/210', width: '100%', maxWidth: '180px' }}>
								<img src={b.coverUrl} alt={`Cover ${b.title}`} className="w-full h-full object-cover transition-transform duration-300" loading="lazy" />
							</div>
						</div>
					) : (
						<div className="w-full flex justify-center mb-4">
							<div className="overflow-hidden rounded-lg border-2 border-gray-300 bg-gray-100 shadow-md flex items-center justify-center transition-transform duration-300 hover:scale-105" style={{ aspectRatio: '148/210', width: '100%', maxWidth: '180px' }}>
								<span className="text-xs text-gray-400">No Cover</span>
							</div>
						</div>
					)}
					<div className="flex-1 flex flex-col gap-1.5 text-left px-1">
						<div className="text-xs text-gray-600 line-clamp-1">{b.writer}</div>
						<div className="font-semibold line-clamp-2 text-base leading-snug font-heading">{b.title}</div>
						<div className="text-[#0588d9] font-bold text-lg">Rp {b.price?.toLocaleString('id-ID')}</div>
						{b.publisher && <div className="text-xs text-gray-500 line-clamp-1">Penerbit: {b.publisher}</div>}
						{b.genre && <div className="text-xs text-gray-500 line-clamp-1">Genre: {b.genre.name}</div>}
						{b.publicationYear && <div className="text-xs text-gray-500">Tahun: {b.publicationYear}</div>}
						{b.condition && <div className="text-xs text-gray-500">Kondisi: {b.condition}</div>}
						<div className="text-xs text-gray-500">Stok: {b.stockQuantity}</div>
					</div>
				</a>
			</div>
		);
	}

	if (!token) {
		return null;
	}

	return (
		<div className="min-h-screen py-10 px-4">
			<SeoHelmet title="Buku Favorit | IT Literature Store" description="Lihat daftar buku favorit Anda." />
			<h1 className="text-3xl font-bold text-[#0588d9] mb-6">Buku Favorit</h1>
			{loading && <div className="text-gray-500">Memuat...</div>}
			{error && <div className="text-red-600">{error}</div>}
			{!loading && !error && items.length === 0 && (
				<div className="text-gray-600">Belum ada buku favorit. Tambahkan buku ke favorit untuk melihatnya di sini.</div>
			)}
			{!loading && !error && items.length > 0 && (
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
					{items.map((b) => (
						<BookCard key={b.id} book={b} />
					))}
				</div>
			)}
		</div>
	);
}

