import SeoHelmet from '../../components/layout/SeoHelmet';

export default function GenresPage() {
	return (
		<div className="min-h-screen py-10 px-4">
			<SeoHelmet title="Admin Genre | IT Literature Store" description="Kelola genre/kategori untuk buku IT Anda." />
			<h1 className="text-3xl font-bold text-[#0588d9] mb-6">Kelola Genre</h1>
			<div className="text-gray-600">[TODO: Data table, create/edit modal]</div>
		</div>
	);
}
