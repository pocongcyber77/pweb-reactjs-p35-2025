import { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SeoHelmet from '../../components/layout/SeoHelmet';
import { api } from '../../utils/http';
import Button from '../../components/ui/Button';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';

interface Genre { id: string; name: string }

export default function EditBookPage() {
	const { id } = useParams();
	const navigate = useNavigate();
	const [genres, setGenres] = useState<Genre[]>([]);
	const [loadingGenres, setLoadingGenres] = useState(true);
	const [loadingBook, setLoadingBook] = useState(true);
	const [genreError, setGenreError] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [saving, setSaving] = useState(false);

	const [title, setTitle] = useState('');
	const [writer, setWriter] = useState('');
	const [publisher, setPublisher] = useState('');
	const [price, setPrice] = useState<number | ''>('');
	const [stockQuantity, setStockQuantity] = useState<number | ''>('');
	const [genreId, setGenreId] = useState('');
	const [description, setDescription] = useState('');
	const [publicationYear, setPublicationYear] = useState<number | ''>('');
	const [condition, setCondition] = useState('');
	const [coverUrl, setCoverUrl] = useState('');

	useEffect(() => {
		// Load genres
		api.get('/genre')
			.then((res) => {
				const genresList = res.data?.data || res.data?.items || res.data || [];
				if (Array.isArray(genresList)) {
					const sorted = [...genresList].sort((a, b) => (a.name || '').localeCompare(b.name || ''));
					setGenres(sorted);
					setGenreError(null);
				} else {
					setGenreError('Format data genre tidak valid');
				}
			})
			.catch((err) => {
				setGenreError(err?.response?.data?.error || 'Gagal memuat genre');
			})
			.finally(() => setLoadingGenres(false));

		// Load book data
		if (id) {
			api.get(`/books/${id}`)
				.then((res) => {
					const book = res.data?.data || res.data;
					if (book) {
						setTitle(book.title || '');
						setWriter(book.writer || '');
						setPublisher(book.publisher || '');
						setPrice(book.price ? Number(book.price) : '');
						setStockQuantity(book.stockQuantity || '');
						setGenreId(book.genre?.id || '');
						setDescription(book.description || '');
						setPublicationYear(book.publicationYear || '');
						setCondition(book.condition || '');
						setCoverUrl(book.coverUrl || '');
					}
				})
				.catch((err) => {
					setError(err?.response?.data?.message || 'Gagal memuat data buku');
				})
				.finally(() => setLoadingBook(false));
		}
	}, [id]);

	const markdownPreview = useMemo(() => description || '', [description]);

	async function onSubmit(e: React.FormEvent) {
		e.preventDefault();
		setError(null);
		if (!title || !writer || !price || !stockQuantity || !genreId) {
			setError('Mohon lengkapi field wajib');
			return;
		}
		if (!publisher || publisher.trim() === '') {
			setError('Penerbit wajib diisi');
			return;
		}
		const priceNum = Number(price);
		if (priceNum > 99999999.99) {
			setError('Harga maksimal adalah Rp 99,999,999.99');
			return;
		}
		if (priceNum <= 0) {
			setError('Harga harus lebih dari 0');
			return;
		}
		try {
			setSaving(true);
			const bookData: any = {
				title: title.trim(),
				writer: writer.trim(),
				publisher: publisher.trim(),
				price: Number(price),
				stock_quantity: Number(stockQuantity),
				genre_id: genreId,
				publication_year: publicationYear && Number(publicationYear) > 0 
					? Number(publicationYear) 
					: new Date().getFullYear(),
			};
			
			if (description && description.trim()) {
				bookData.description = description.trim();
			}
			if (coverUrl && coverUrl.trim()) {
				bookData.cover_url = coverUrl.trim();
			}
			if (condition && condition.trim()) {
				bookData.condition = condition.trim();
			}
			
			await api.patch(`/books/${id}`, bookData);
			alert('Buku berhasil diperbarui!');
			navigate('/mimin/books');
		} catch (e: any) {
			const errorData = e?.response?.data || {};
			let errorMessage = errorData.error || errorData.message || e?.message || 'Gagal memperbarui buku.';
			if (errorData.details) {
				errorMessage += `\n${errorData.details}`;
			}
			setError(errorMessage);
		} finally {
			setSaving(false);
		}
	}

	if (loadingBook) {
		return (
			<div className="min-h-screen py-10 px-4">
				<div className="text-gray-500">Memuat data buku...</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen py-10 px-4">
			<SeoHelmet title="Edit Buku | IT Literature Store" description="Form untuk mengedit buku." />
			<h1 className="text-3xl font-bold text-[#0588d9] mb-6">Edit Buku</h1>
			<form onSubmit={onSubmit} className="rounded-2xl bg-white/70 backdrop-blur-md shadow-glass p-6 border border-white/60 space-y-4 max-w-3xl">
				{error && (
					<div className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg p-3 whitespace-pre-line">
						{error}
					</div>
				)}
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
					<label className="text-sm">Judul<input value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1 w-full rounded-xl border px-3 py-2" required /></label>
					<label className="text-sm">Penulis<input value={writer} onChange={(e) => setWriter(e.target.value)} className="mt-1 w-full rounded-xl border px-3 py-2" required /></label>
					<label className="text-sm">Penerbit<input value={publisher} onChange={(e) => setPublisher(e.target.value)} className="mt-1 w-full rounded-xl border px-3 py-2" /></label>
					<label className="text-sm">Harga<input type="number" value={price} onChange={(e) => setPrice(e.target.value === '' ? '' : Number(e.target.value))} className="mt-1 w-full rounded-xl border px-3 py-2" required /></label>
					<label className="text-sm">Stok<input type="number" value={stockQuantity} onChange={(e) => setStockQuantity(e.target.value === '' ? '' : Number(e.target.value))} className="mt-1 w-full rounded-xl border px-3 py-2" required /></label>
					<label className="text-sm">Tahun Terbit<input type="number" value={publicationYear} onChange={(e) => setPublicationYear(e.target.value === '' ? '' : Number(e.target.value))} className="mt-1 w-full rounded-xl border px-3 py-2" /></label>
					<label className="text-sm">Kondisi
						<select value={condition} onChange={(e) => setCondition(e.target.value)} className="mt-1 w-full rounded-xl border px-3 py-2 bg-white">
							<option value="">Pilih Kondisi</option>
							<option value="Baru">Baru</option>
							<option value="Bekas">Bekas</option>
							<option value="Berkarat">Berkarat</option>
							<option value="Berjamur">Berjamur</option>
							<option value="Kroak">Kroak</option>
							<option value="Hilang">Hilang</option>
						</select>
					</label>
					<label className="text-sm">Link Cover (URL) <input value={coverUrl} onChange={(e) => setCoverUrl(e.target.value)} className="mt-1 w-full rounded-xl border px-3 py-2" placeholder="https://example.com/cover.jpg" /></label>
					<label className="text-sm">Genre
						<select 
							value={genreId} 
							onChange={(e) => setGenreId(e.target.value)} 
							className="mt-1 w-full rounded-xl border px-3 py-2 bg-white" 
							required
							disabled={loadingGenres}
						>
							<option value="" disabled>
								{loadingGenres ? 'Memuat genre...' : 'Pilih genre'}
							</option>
							{genres.length === 0 && !loadingGenres ? (
								<option value="" disabled>Tidak ada genre tersedia</option>
							) : (
								genres.map((g) => (
									<option key={g.id} value={g.id}>{g.name}</option>
								))
							)}
						</select>
						{genreError && genres.length === 0 && !loadingGenres && (
							<p className="text-xs text-red-600 mt-1">{genreError}</p>
						)}
					</label>
				</div>
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
					<label className="text-sm">Deskripsi (Markdown)
						<textarea value={description} onChange={(e) => setDescription(e.target.value)} className="mt-1 w-full rounded-xl border px-3 py-2" rows={10} />
					</label>
					<div>
						<div className="text-sm mb-2">Preview</div>
						<div className="rounded-xl border border-white/60 bg-white/70 p-3 prose max-w-none space-y-4">
							{coverUrl && (
								<div className="w-full">
									<img src={coverUrl} alt="Preview cover" className="w-full h-48 object-cover rounded-xl border border-white/60" onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }} />
								</div>
							)}
							{markdownPreview ? (
								<ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
									{markdownPreview}
								</ReactMarkdown>
							) : (
								<div className="text-sm text-gray-400">Deskripsi markdown akan ditampilkan di sini</div>
							)}
						</div>
					</div>
				</div>
				<div className="flex gap-3">
					<Button disabled={saving} type="submit">{saving ? 'Menyimpan...' : 'Simpan Perubahan'}</Button>
					<Button type="button" variant="ghost" onClick={() => navigate('/mimin/books')}>Batal</Button>
				</div>
			</form>
		</div>
	);
}

