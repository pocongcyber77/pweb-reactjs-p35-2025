import SeoHelmet from '../../components/layout/SeoHelmet';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../../components/ui/Button';
import { api } from '../../utils/http';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function CartPage() {
	const { items, subtotal, update, remove, clear } = useCart();
	const { token } = useAuth();
	const navigate = useNavigate();
	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState<string | null>(null);

	async function checkout() {
		setMessage(null);
		if (items.length === 0) { 
			setMessage('Keranjang kosong'); 
			return; 
		}
		if (!token) {
			setMessage('Silakan login terlebih dahulu untuk checkout');
			setTimeout(() => navigate('/auth/login'), 2000);
			return;
		}
		setLoading(true);
		try {
			await api.post('/transactions', {
				items: items.map((i) => ({ book_id: i.bookId, quantity: i.quantity })),
			});
			setMessage('Transaksi berhasil dibuat');
			clear();
		} catch (e: any) {
			const errorMsg = e?.response?.data?.error || e?.response?.data?.message || e?.response?.data?.details || 'Gagal membuat transaksi';
			setMessage(errorMsg);
		} finally {
			setLoading(false);
		}
	}

	return (
		<div className="min-h-screen py-10 px-4">
			<SeoHelmet title="Cart | IT Literature Store" description="Lihat keranjang belanja Anda dan lanjutkan ke penawaran atau checkout." />
			<h1 className="text-3xl font-bold text-[#0588d9] mb-6">Cart</h1>
			{message && <div className="mb-4 text-sm text-gray-700">{message}</div>}
			{items.length === 0 ? (
				<div className="text-gray-600">Keranjang kosong</div>
			) : (
				<div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
					<ul className="space-y-3">
						{items.map((it) => (
							<li key={it.bookId} className="rounded-2xl bg-white/70 backdrop-blur-md shadow-glass p-4 border border-white/60 flex items-center justify-between">
								<div>
									<div className="font-semibold">{it.title}</div>
									<div className="text-sm text-gray-600">Rp {it.price.toLocaleString('id-ID')}</div>
								</div>
								<div className="flex items-center gap-2">
									<input type="number" min={1} value={it.quantity} onChange={(e) => update(it.bookId, Math.max(1, Number(e.target.value)))} className="w-20 rounded-xl border px-2 py-1" />
									<Button variant="ghost" onClick={() => remove(it.bookId)}>Hapus</Button>
								</div>
							</li>
						))}
					</ul>
					<div className="rounded-2xl bg-white/70 backdrop-blur-md shadow-glass p-4 border border-white/60">
						<div className="font-semibold">Ringkasan</div>
						<div className="mt-2 text-gray-700">Subtotal: Rp {subtotal.toLocaleString('id-ID')}</div>
						<Button disabled={loading} onClick={checkout} className="mt-4 w-full">{loading ? 'Memproses...' : 'Checkout'}</Button>
					</div>
				</div>
			)}
		</div>
	);
}
