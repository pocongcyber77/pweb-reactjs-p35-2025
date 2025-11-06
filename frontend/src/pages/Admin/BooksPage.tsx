import SeoHelmet from '../../components/layout/SeoHelmet';

export default function BooksPage() {
	return (
		<div className="min-h-screen py-10 px-4">
			<SeoHelmet title="Admin Buku | IT Literature Store" description="Kelola katalog buku: tambah, ubah, dan hapus buku IT." />
			<h1 className="text-3xl font-bold text-[#0588d9] mb-6">Kelola Buku</h1>
			<div className="text-gray-600">[TODO: Data table, create/edit modal]</div>
		</div>
	);
}
