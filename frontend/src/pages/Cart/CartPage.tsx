import SeoHelmet from '../../components/layout/SeoHelmet';

export default function CartPage() {
	return (
		<div className="min-h-screen py-10 px-4">
			<SeoHelmet title="Cart | IT Literature Store" description="Lihat keranjang belanja Anda dan lanjutkan ke penawaran atau checkout." />
			<h1 className="text-3xl font-bold text-[#0588d9] mb-6">Cart</h1>
			<div className="text-gray-600">[TODO: Line items, summary, actions]</div>
		</div>
	);
}
