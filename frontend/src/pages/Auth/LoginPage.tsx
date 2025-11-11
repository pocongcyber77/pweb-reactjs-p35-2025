import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import SeoHelmet from '../../components/layout/SeoHelmet';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../../components/ui/Button';

export default function LoginPage() {
	const { login } = useAuth();
	const location = useLocation();
	const navigate = useNavigate();
	const [emailOrUsername, setEmailOrUsername] = useState('');
	const [password, setPassword] = useState('');
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	async function onSubmit(e: React.FormEvent) {
		e.preventDefault();
		setError(null);
		setLoading(true);
		try {
			await login(emailOrUsername, password);
			// Redirect to the page user was trying to access, or default to /books
			const from = (location.state as any)?.from || '/books';
			navigate(from, { replace: true });
		} catch (err: any) {
			console.error('Login error details:', err);
			const errorMessage = 
				err?.response?.data?.error || 
				err?.response?.data?.message || 
				err?.message || 
				'Login gagal. Periksa username/email dan password Anda.';
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
					<span className="text-gray-600">Username atau Email</span>
					<input value={emailOrUsername} onChange={(e) => setEmailOrUsername(e.target.value)} type="text" required className="mt-1 w-full rounded-xl border px-3 py-2" placeholder="Masukkan username atau email" />
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
