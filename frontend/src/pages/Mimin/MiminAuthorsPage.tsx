import { useEffect, useState } from 'react';
import SeoHelmet from '../../components/layout/SeoHelmet';
import { api } from '../../utils/http';
import Button from '../../components/ui/Button';

export default function MiminAuthorsPage() {
	const [items, setItems] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [nama, setNama] = useState('');
	const [bio, setBio] = useState('');
	const [saving, setSaving] = useState(false);

	async function load() {
		setLoading(true);
		setError(null);
		try {
			const res = await api.get('/id/penulis');
			setItems(res.data?.data || res.data || []);
		} catch (e: any) {
			setError(e?.response?.data?.message || 'Gagal memuat penulis');
		} finally { setLoading(false); }
	}
	useEffect(() => { load(); }, []);

	async function onCreate(e: React.FormEvent) {
		e.preventDefault();
		if (!nama) return;
		setSaving(true);
		try {
			await api.post('/id/penulis', { nama_penulis: nama, bio: bio || undefined });
			setNama(''); setBio('');
			await load();
		} catch (e: any) {
			alert(e?.response?.data?.message || 'Gagal menambah penulis');
		} finally { setSaving(false); }
	}

	return (
		<div className="min-h-screen py-10 px-4">
			<SeoHelmet title="Mimin: Penulis | IT Literature Store" description="Kelola data penulis dan biografi." />
			<h1 className="text-3xl font-bold text-[#0588d9] mb-6">Penulis</h1>
			{loading && <div className="text-gray-500">Memuat...</div>}
			{error && <div className="text-red-600">{error}</div>}
			<form onSubmit={onCreate} className="rounded-2xl bg-white/70 backdrop-blur-md shadow-glass p-4 border border-white/60 space-y-3 max-w-xl mb-6">
				<input value={nama} onChange={(e) => setNama(e.target.value)} placeholder="Nama penulis" className="w-full rounded-xl border px-3 py-2" required />
				<textarea value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Bio singkat" rows={4} className="w-full rounded-xl border px-3 py-2" />
				<Button disabled={saving} type="submit">{saving ? 'Menyimpan...' : 'Tambah Penulis'}</Button>
			</form>
			<ul className="space-y-2">
				{items.map((p) => (
					<li key={p.id_penulis} className="rounded-xl bg-white/70 border border-white/60 p-3">
						<div className="font-semibold text-sm">{p.nama_penulis}</div>
						{p.bio && <div className="text-xs text-gray-600 mt-1">{p.bio}</div>}
					</li>
				))}
			</ul>
		</div>
	);
}
