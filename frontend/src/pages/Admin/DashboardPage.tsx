import SeoHelmet from '../../components/layout/SeoHelmet';

export default function DashboardPage() {
	return (
		<div className="min-h-screen py-10 px-4">
			<SeoHelmet title="Admin Dashboard | IT Literature Store" description="Ringkasan metrik dan aktivitas toko buku IT Anda." />
			<h1 className="text-3xl font-bold text-[#0588d9] mb-6">Dashboard</h1>
			<div className="text-gray-600">[TODO: KPI tiles, charts]</div>
		</div>
	);
}
