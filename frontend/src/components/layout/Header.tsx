import { useAuth } from '../../contexts/AuthContext';
import Button from '../ui/Button';

export default function Header() {
	const { user, logout } = useAuth();
	return (
		<header className="sticky top-0 z-40 bg-white/70 backdrop-blur-md border-b border-white/60">
			<div className="container mx-auto px-4 h-16 flex items-center justify-between">
				<a href="/" className="font-semibold tracking-tight">IT LitShop</a>
				<nav className="flex items-center gap-4 text-sm">
					<a href="/books" className="hover:text-[#0588d9]">Buku</a>
					<a href="/cart" className="hover:text-[#0588d9]">Cart</a>
					<a href="/me/orders" className="hover:text-[#0588d9]">Transaksi</a>
					{user ? (
						<div className="flex items-center gap-3">
							<span className="text-gray-700 hidden sm:inline">{user.email}</span>
							<Button variant="ghost" onClick={() => { logout(); window.location.href = '/auth/login'; }}>Logout</Button>
						</div>
					) : (
						<a href="/auth/login" className="hover:text-[#0588d9]">Login</a>
					)}
				</nav>
			</div>
		</header>
	);
}
