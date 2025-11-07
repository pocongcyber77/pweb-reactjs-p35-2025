import { useEffect, useMemo, useState } from 'react';
import SeoHelmet from '../../components/layout/SeoHelmet';
import { api } from '../../utils/http';
import Button from '../../components/ui/Button';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';

interface Genre { id: string; name: string }

export default function AddBookPage() {
	const [genres, setGenres] = useState<Genre[]>([]);
	const [loadingGenres, setLoadingGenres] = useState(true);
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
		api.get('/genre')
			.then((res) => {
				console.log('Genre response:', res.data);
				// Backend mengembalikan { message, data: genres[], pagination }
				const genresList = res.data?.data || res.data?.items || res.data || [];
				if (Array.isArray(genresList)) {
					const sorted = [...genresList].sort((a, b) => (a.name || '').localeCompare(b.name || ''));
					setGenres(sorted);
					setGenreError(null);
				} else {
					console.error('Invalid genres format:', genresList);
					setGenreError('Format data genre tidak valid');
				}
			})
			.catch((err) => {
				console.error('Error loading genres:', err);
				setGenreError(err?.response?.data?.error || 'Gagal memuat genre');
			})
			.finally(() => setLoadingGenres(false));
	}, []);

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
		// Validasi harga: maksimal 99,999,999.99 (Decimal(10,2))
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
			// Format data sesuai backend (snake_case)
			const bookData: any = {
				title: title.trim(),
				writer: writer.trim(),
				publisher: publisher.trim(),
				price: Number(price),
				stock_quantity: Number(stockQuantity),
				genre_id: genreId,
				// publication_year is required in database, use current year if not provided
				publication_year: publicationYear && Number(publicationYear) > 0 
					? Number(publicationYear) 
					: new Date().getFullYear(),
			};
			
			// Tambahkan field optional jika ada
			if (description && description.trim()) {
				bookData.description = description.trim();
			}
			if (coverUrl && coverUrl.trim()) {
				bookData.cover_url = coverUrl.trim();
			}
			
			console.log('Sending book data:', bookData);
			const response = await api.post('/books', bookData);
			console.log('Book created:', response.data);
			alert('Buku berhasil ditambahkan!');
			window.location.href = '/mimin/books';
		} catch (e: any) {
			console.error('Error creating book:', e);
			const errorData = e?.response?.data || {};
			let errorMessage = errorData.error || errorData.message || e?.message || 'Gagal menyimpan buku. Periksa data yang Anda masukkan.';
			
			// Tambahkan details jika ada
			if (errorData.details) {
				errorMessage += `\n${errorData.details}`;
			}
			
			setError(errorMessage);
		} finally {
			setSaving(false);
		}
	}

	return (
		<div className="min-h-screen py-10 px-4">
			<SeoHelmet title="Tambah Buku | IT Literature Store" description="Form untuk menambahkan buku baru dengan genre." />
			<h1 className="text-3xl font-bold text-[#0588d9] mb-6">Tambah Buku</h1>
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
					<label className="text-sm">Kondisi<input value={condition} onChange={(e) => setCondition(e.target.value)} className="mt-1 w-full rounded-xl border px-3 py-2" placeholder="baru/bekas" /></label>
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
						{genres.length > 0 && (
							<p className="text-xs text-gray-500 mt-1">{genres.length} genre tersedia</p>
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
				<Button disabled={saving} type="submit">{saving ? 'Menyimpan...' : 'Simpan'}</Button>
			</form>
		</div>
	);
}
