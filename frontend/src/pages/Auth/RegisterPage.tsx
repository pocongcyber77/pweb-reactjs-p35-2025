import { useState } from 'react';
import SeoHelmet from '../../components/layout/SeoHelmet';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../../components/ui/Button';

export default function RegisterPage() {
	const { register } = useAuth();
	const [email, setEmail] = useState('');
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [confirm, setConfirm] = useState('');
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	async function onSubmit(e: React.FormEvent) {
		e.preventDefault();
		setError(null);
		if (username.trim().length < 2) { setError('Username minimal 2 karakter'); return; }
		if (password.length < 6) { setError('Password minimal 6 karakter'); return; }
		if (password !== confirm) { setError('Konfirmasi password tidak cocok'); return; }
		setLoading(true);
		try {
			await register(email, password, username.trim());
			window.location.href = '/books';
		} catch (err: any) {
			console.error('Register error details:', err);
			const errorMessage = 
				err?.response?.data?.error || 
				err?.response?.data?.message || 
				err?.message || 
				'Registrasi gagal. Periksa data yang Anda masukkan.';
			setError(errorMessage);
		} finally {
			setLoading(false);
		}
	}

	return (
		<div className="min-h-screen py-10 px-4 grid place-items-center">
			<SeoHelmet title="Daftar | IT Literature Store" description="Buat akun untuk menyimpan pesanan dan mempercepat checkout." />
			<form onSubmit={onSubmit} className="w-full max-w-md rounded-2xl bg-white/70 backdrop-blur-md shadow-glass p-6 border border-white/60 space-y-4">
				<h1 className="text-3xl font-bold text-[#0588d9]">Daftar</h1>
				{error && <div className="text-red-600 text-sm">{error}</div>}
				<label className="block text-sm">
					<span className="text-gray-600">Email</span>
					<input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required className="mt-1 w-full rounded-xl border px-3 py-2" />
				</label>
				<label className="block text-sm">
					<span className="text-gray-600">Username</span>
					<input value={username} onChange={(e) => setUsername(e.target.value)} type="text" required minLength={2} className="mt-1 w-full rounded-xl border px-3 py-2" />
				</label>
				<label className="block text-sm">
					<span className="text-gray-600">Password</span>
					<input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required minLength={6} className="mt-1 w-full rounded-xl border px-3 py-2" />
				</label>
				<label className="block text-sm">
					<span className="text-gray-600">Konfirmasi Password</span>
					<input value={confirm} onChange={(e) => setConfirm(e.target.value)} type="password" required className="mt-1 w-full rounded-xl border px-3 py-2" />
				</label>
				<Button disabled={loading} type="submit">{loading ? 'Memproses...' : 'Daftar'}</Button>
				<p className="text-sm text-gray-600">Sudah punya akun? <a className="text-[#0588d9]" href="/auth/login">Masuk</a></p>
			</form>
		</div>
	);
}
