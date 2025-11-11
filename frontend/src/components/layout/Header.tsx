import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../ui/Button';

export default function Header() {
	const { user, logout, token } = useAuth();
	const navigate = useNavigate();

	const handleTransaksiClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
		if (!token) {
			e.preventDefault();
			navigate('/auth/login', { state: { from: '/me/orders' } });
		}
	};

	const handleCartClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
		if (!token) {
			e.preventDefault();
			navigate('/auth/login', { state: { from: '/cart' } });
		}
	};

	return (
		<header className="sticky top-0 z-40 bg-white/70 backdrop-blur-md border-b border-white/60 font-heading">
			<div className="container mx-auto px-4 h-16 flex items-center justify-between max-w-6xl">
				<Link to="/" className="font-semibold tracking-tight font-heading">IT LitShop</Link>
				<nav className="flex items-center gap-4 text-sm font-heading">
					<Link to="/books" className="hover:text-[#0588d9]">Buku</Link>
					{user && <Link to="/favorites" className="hover:text-[#0588d9]">Favorit</Link>}
					<Link to="/cart" className="hover:text-[#0588d9]" onClick={handleCartClick}>Keranjang</Link>
					<Link to="/me/orders" className="hover:text-[#0588d9]" onClick={handleTransaksiClick}>Transaksi</Link>
					{user ? (
						<div className="flex items-center gap-3">
							<span className="text-gray-700 hidden sm:inline">{user.email}</span>
							<Button variant="ghost" onClick={() => { logout(); window.location.href = '/auth/login'; }}>Logout</Button>
						</div>
					) : (
						<Link to="/auth/login" className="hover:text-[#0588d9]">Login</Link>
					)}
				</nav>
			</div>
		</header>
	);
}
