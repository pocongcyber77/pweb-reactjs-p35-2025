import { useEffect, useState } from 'react';
import SeoHelmet from '../../components/layout/SeoHelmet';
import { api } from '../../utils/http';
import Button from '../../components/ui/Button';

export default function MiminUsersPage() {
	const [items, setItems] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [role, setRole] = useState<'Admin' | 'Kasir' | 'Manager'>('Kasir');
	const [saving, setSaving] = useState(false);

	async function load() {
		setLoading(true);
		setError(null);
		try {
			const res = await api.get('/id/admin/users');
			setItems(res.data?.data || res.data || []);
		} catch (e: any) {
			setError(e?.response?.data?.message || 'Gagal memuat users');
		} finally {
			setLoading(false);
		}
	}

	useEffect(() => { load(); }, []);

	async function onCreate(e: React.FormEvent) {
		e.preventDefault();
		if (!username || !password) return;
		setSaving(true);
		try {
			await api.post('/id/admin/users', { username, password, role });
			setUsername(''); setPassword(''); setRole('Kasir');
			await load();
		} catch (e: any) {
			alert(e?.response?.data?.message || 'Gagal menambah user');
		} finally { setSaving(false); }
	}

	return (
		<div className="min-h-screen py-10 px-4">
			<SeoHelmet title="Mimin: Users | IT Literature Store" description="Kelola akun pengguna sistem (Admin/Kasir/Manager)." />
			<h1 className="text-3xl font-bold text-[#0588d9] mb-6">Users</h1>
			{loading && <div className="text-gray-500">Memuat...</div>}
			{error && <div className="text-red-600">{error}</div>}
			<form onSubmit={onCreate} className="rounded-2xl bg-white/70 backdrop-blur-md shadow-glass p-4 border border-white/60 space-y-3 max-w-xl mb-6">
				<div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
					<input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" className="rounded-xl border px-3 py-2" required />
					<input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" type="password" className="rounded-xl border px-3 py-2" required />
					<select value={role} onChange={(e) => setRole(e.target.value as any)} className="rounded-xl border px-3 py-2">
						<option value="Kasir">Kasir</option>
						<option value="Admin">Admin</option>
						<option value="Manager">Manager</option>
					</select>
				</div>
				<Button disabled={saving} type="submit">{saving ? 'Menyimpan...' : 'Tambah User'}</Button>
			</form>
			<ul className="space-y-2">
				{items.map((u) => (
					<li key={u.id_user} className="rounded-xl bg-white/70 border border-white/60 p-3 flex items-center justify-between">
						<div className="text-sm"><span className="font-semibold">{u.username}</span> · {u.role}</div>
					</li>
				))}
			</ul>
		</div>
	);
}
