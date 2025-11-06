import SeoHelmet from '../../components/layout/SeoHelmet';

export default function OrderDetailPage() {
	return (
		<div className="min-h-screen py-10 px-4">
			<SeoHelmet title="Detail Pesanan | IT Literature Store" description="Detail pesanan Anda termasuk item, total, dan status." />
			<h1 className="text-3xl font-bold text-[#0588d9] mb-6">Detail Pesanan</h1>
			<div className="text-gray-600">[TODO: Items, totals, status]</div>
		</div>
	);
}
