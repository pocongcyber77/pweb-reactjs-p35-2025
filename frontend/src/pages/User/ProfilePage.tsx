import SeoHelmet from '../../components/layout/SeoHelmet';

export default function ProfilePage() {
	return (
		<div className="min-h-screen py-10 px-4">
			<SeoHelmet title="Profil | IT Literature Store" description="Lihat dan kelola profil akun Anda." />
			<h1 className="text-3xl font-bold text-[#0588d9] mb-6">Profil</h1>
			<div className="text-gray-600">[TODO: Profile summary, update password]</div>
		</div>
	);
}
