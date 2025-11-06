import SeoHelmet from '../../components/layout/SeoHelmet';

export default function OrdersPage() {
	return (
		<div className="min-h-screen py-10 px-4">
			<SeoHelmet title="Pesanan Saya | IT Literature Store" description="Lihat daftar pesanan Anda dan statusnya." />
			<h1 className="text-3xl font-bold text-[#0588d9] mb-6">Pesanan Saya</h1>
			<div className="text-gray-600">[TODO: Orders list, pagination]</div>
		</div>
	);
}
