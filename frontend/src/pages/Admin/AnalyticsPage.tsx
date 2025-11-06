import SeoHelmet from '../../components/layout/SeoHelmet';

export default function AnalyticsPage() {
	return (
		<div className="min-h-screen py-10 px-4">
			<SeoHelmet title="Admin Analytics | IT Literature Store" description="Laporan penjualan dan statistik performa toko buku IT." />
			<h1 className="text-3xl font-bold text-[#0588d9] mb-6">Analytics</h1>
			<div className="text-gray-600">[TODO: Charts, KPIs]</div>
		</div>
	);
}
