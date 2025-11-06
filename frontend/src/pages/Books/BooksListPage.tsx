import SeoHelmet from '../../components/layout/SeoHelmet';

export default function BooksListPage() {
	return (
		<div className="min-h-screen py-10 px-4">
			<SeoHelmet title="Semua Buku | IT Literature Store" description="Temukan berbagai buku IT terbaik di toko kami." />
			<h1 className="text-3xl font-bold text-[#0588d9] mb-6">Semua Buku</h1>
			<div className="text-gray-600">[TODO: Books grid, filters, pagination]</div>
		</div>
	);
}
