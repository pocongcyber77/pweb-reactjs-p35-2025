import SeoHelmet from '../../components/layout/SeoHelmet';

export default function RegisterPage() {
	return (
		<div className="min-h-screen py-10 px-4 grid place-items-center">
			<SeoHelmet title="Daftar | IT Literature Store" description="Buat akun untuk menyimpan pesanan dan mempercepat checkout." />
			<div className="w-full max-w-md rounded-2xl bg-white/70 backdrop-blur-md shadow-glass p-6 border border-white/60">
				<h1 className="text-3xl font-bold text-[#0588d9] mb-4">Daftar</h1>
				<div className="text-gray-600">[TODO: Register form]</div>
			</div>
		</div>
	);
}
