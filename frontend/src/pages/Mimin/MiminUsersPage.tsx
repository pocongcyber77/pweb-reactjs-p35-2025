import { useEffect, useState } from 'react';
import SeoHelmet from '../../components/layout/SeoHelmet';
import { api } from '../../utils/http';
import Button from '../../components/ui/Button';

export default function MiminUsersPage() {
	const [items, setItems] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [username, setUsername] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [role, setRole] = useState<'User' | 'Admin' | 'Presiden' | 'Dewa'>('User');
	const [saving, setSaving] = useState(false);
	
	// Edit state
	const [editingId, setEditingId] = useState<number | null>(null);
	const [editUsername, setEditUsername] = useState('');
	const [editEmail, setEditEmail] = useState('');
	const [editPassword, setEditPassword] = useState('');
	const [editRole, setEditRole] = useState<'User' | 'Admin' | 'Presiden' | 'Dewa'>('User');
	const [editing, setEditing] = useState(false);

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
		if (!username || !email || !password) return;
		setSaving(true);
		try {
			await api.post('/id/admin/users', { username, email, password, role });
			setUsername(''); setEmail(''); setPassword(''); setRole('User');
			await load();
		} catch (e: any) {
			alert(e?.response?.data?.message || 'Gagal menambah user');
		} finally { setSaving(false); }
	}

	function startEdit(user: any) {
		setEditingId(user.id_user);
		setEditUsername(user.username);
		setEditEmail(user.email);
		setEditPassword('');
		setEditRole(user.role);
		setEditing(true);
	}

	function cancelEdit() {
		setEditingId(null);
		setEditUsername('');
		setEditEmail('');
		setEditPassword('');
		setEditRole('User');
		setEditing(false);
	}

	async function onUpdate(e: React.FormEvent) {
		e.preventDefault();
		if (!editingId || !editUsername || !editEmail) return;
		setSaving(true);
		try {
			const updateData: any = { username: editUsername, email: editEmail, role: editRole };
			if (editPassword) updateData.password = editPassword;
			
			await api.put(`/id/admin/users/${editingId}`, updateData);
			cancelEdit();
			await load();
		} catch (e: any) {
			alert(e?.response?.data?.message || 'Gagal memperbarui user');
		} finally { setSaving(false); }
	}

	async function onDelete(id: number) {
		if (!confirm('Apakah Anda yakin ingin menghapus user ini?')) return;
		setSaving(true);
		try {
			await api.delete(`/id/admin/users/${id}`);
			await load();
		} catch (e: any) {
			alert(e?.response?.data?.message || 'Gagal menghapus user');
		} finally { setSaving(false); }
	}

	const getRoleBadgeColor = (role: string) => {
		switch (role) {
			case 'Admin': return 'bg-blue-100 text-blue-800';
			case 'Presiden': return 'bg-purple-100 text-purple-800';
			case 'Dewa': return 'bg-yellow-100 text-yellow-800';
			default: return 'bg-gray-100 text-gray-800';
		}
	};

	return (
		<div className="min-h-screen py-10 px-4">
			<SeoHelmet title="Mimin: Users | IT Literature Store" description="Kelola akun pengguna sistem." />
			<h1 className="text-3xl font-bold text-[#0588d9] mb-6">Manajemen User</h1>
			
			{loading && <div className="text-gray-500">Memuat...</div>}
			{error && <div className="text-red-600 mb-4">{error}</div>}

			{/* Form Tambah User */}
			{!editing && (
				<form onSubmit={onCreate} className="rounded-2xl bg-white/70 backdrop-blur-md shadow-glass p-4 border border-white/60 space-y-3 max-w-4xl mb-6">
					<h2 className="text-xl font-semibold text-[#0588d9] mb-3">Tambah User Baru</h2>
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
					<input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" className="rounded-xl border px-3 py-2" required />
						<input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" type="email" className="rounded-xl border px-3 py-2" required />
					<input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" type="password" className="rounded-xl border px-3 py-2" required />
					<select value={role} onChange={(e) => setRole(e.target.value as any)} className="rounded-xl border px-3 py-2">
							<option value="User">User biasa/client</option>
						<option value="Admin">Admin</option>
							<option value="Presiden">Presiden</option>
							<option value="Dewa">Dewa</option>
					</select>
				</div>
				<Button disabled={saving} type="submit">{saving ? 'Menyimpan...' : 'Tambah User'}</Button>
			</form>
			)}

			{/* Form Edit User */}
			{editing && (
				<form onSubmit={onUpdate} className="rounded-2xl bg-white/70 backdrop-blur-md shadow-glass p-4 border border-white/60 space-y-3 max-w-4xl mb-6">
					<h2 className="text-xl font-semibold text-[#0588d9] mb-3">Edit User</h2>
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
						<input value={editUsername} onChange={(e) => setEditUsername(e.target.value)} placeholder="Username" className="rounded-xl border px-3 py-2" required />
						<input value={editEmail} onChange={(e) => setEditEmail(e.target.value)} placeholder="Email" type="email" className="rounded-xl border px-3 py-2" required />
						<input value={editPassword} onChange={(e) => setEditPassword(e.target.value)} placeholder="Password (kosongkan jika tidak diubah)" type="password" className="rounded-xl border px-3 py-2" />
						<select value={editRole} onChange={(e) => setEditRole(e.target.value as any)} className="rounded-xl border px-3 py-2">
							<option value="User">User biasa/client</option>
							<option value="Admin">Admin</option>
							<option value="Presiden">Presiden</option>
							<option value="Dewa">Dewa</option>
						</select>
					</div>
					<div className="flex gap-2">
						<Button disabled={saving} type="submit">{saving ? 'Menyimpan...' : 'Simpan Perubahan'}</Button>
						<Button type="button" variant="ghost" onClick={cancelEdit}>Batal</Button>
					</div>
				</form>
			)}

			{/* List Users */}
			<div className="rounded-2xl bg-white/70 backdrop-blur-md shadow-glass border border-white/60 overflow-hidden">
				<div className="p-4 border-b border-white/60">
					<h2 className="text-xl font-semibold text-[#0588d9]">Daftar User ({items.length})</h2>
				</div>
				{items.length === 0 ? (
					<div className="p-6 text-center text-gray-500">Belum ada user</div>
				) : (
					<div className="overflow-x-auto">
						<table className="w-full">
							<thead className="bg-gray-50/50">
								<tr>
									<th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">ID</th>
									<th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Username</th>
									<th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
									<th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Role</th>
									<th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Aksi</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-gray-200/50">
				{items.map((u) => (
									<tr key={u.id_user} className="hover:bg-gray-50/30">
										<td className="px-4 py-3 text-sm text-gray-600">{u.id_user}</td>
										<td className="px-4 py-3 text-sm font-medium">{u.username}</td>
										<td className="px-4 py-3 text-sm text-gray-600">{u.email}</td>
										<td className="px-4 py-3">
											<span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleBadgeColor(u.role)}`}>
												{u.role}
											</span>
										</td>
										<td className="px-4 py-3">
											<div className="flex gap-2">
												<Button 
													variant="ghost" 
													onClick={() => startEdit(u)}
													disabled={editing || saving}
													className="text-sm px-3 py-1"
												>
													Edit
												</Button>
												<Button 
													variant="ghost" 
													onClick={() => onDelete(u.id_user)}
													disabled={editing || saving}
													className="text-sm px-3 py-1 text-red-600 hover:text-red-700"
												>
													Hapus
												</Button>
											</div>
										</td>
									</tr>
				))}
							</tbody>
						</table>
					</div>
				)}
			</div>
		</div>
	);
}
