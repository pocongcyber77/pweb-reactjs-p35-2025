import { useState } from 'react';
import SeoHelmet from '../../components/layout/SeoHelmet';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../../components/ui/Button';

export default function LoginPage() {
	const { login } = useAuth();
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	async function onSubmit(e: React.FormEvent) {
		e.preventDefault();
		setError(null);
		setLoading(true);
		try {
			await login(email, password);
			window.location.href = '/books';
		} catch (err: any) {
			console.error('Login error details:', err);
			const errorMessage = 
				err?.response?.data?.error || 
				err?.response?.data?.message || 
				err?.message || 
				'Login gagal. Periksa email dan password Anda.';
			setError(errorMessage);
		} finally {
			setLoading(false);
		}
	}

	return (
		<div className="min-h-screen py-10 px-4 grid place-items-center">
			<SeoHelmet title="Masuk | IT Literature Store" description="Masuk untuk mengelola pesanan dan akses fitur lanjutan." />
			<form onSubmit={onSubmit} className="w-full max-w-md rounded-2xl bg-white/70 backdrop-blur-md shadow-glass p-6 border border-white/60 space-y-4">
				<h1 className="text-3xl font-bold text-[#0588d9]">Masuk</h1>
				{error && <div className="text-red-600 text-sm">{error}</div>}
				<label className="block text-sm">
					<span className="text-gray-600">Email</span>
					<input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required className="mt-1 w-full rounded-xl border px-3 py-2" />
				</label>
				<label className="block text-sm">
					<span className="text-gray-600">Password</span>
					<input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required className="mt-1 w-full rounded-xl border px-3 py-2" />
				</label>
				<Button disabled={loading} type="submit">{loading ? 'Memproses...' : 'Login'}</Button>
				<p className="text-sm text-gray-600">Belum punya akun? <a className="text-[#0588d9]" href="/auth/register">Daftar</a></p>
			</form>
		</div>
	);
}
