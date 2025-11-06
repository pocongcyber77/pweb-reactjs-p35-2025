import SeoHelmet from '../../components/layout/SeoHelmet';

export default function HomePage() {
	return (
		<div className="min-h-screen py-10 px-4">
			<SeoHelmet title="Beranda | IT Literature Store" description="Toko buku literatur IT modern: temukan buku terbaik, cepat, dan elegan." />
			<h1 className="text-3xl font-bold text-[#0588d9] mb-6">IT Literature Bookstore</h1>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				<div className="rounded-2xl bg-white/70 backdrop-blur-md shadow-glass p-6 border border-white/60">[TODO: Featured Genres]</div>
				<div className="rounded-2xl bg-white/70 backdrop-blur-md shadow-glass p-6 border border-white/60">[TODO: Trending Books]</div>
			</div>
		</div>
	);
}
