import { Outlet, NavLink } from 'react-router-dom';

export default function AdminLayout() {
	return (
		<div className="min-h-screen grid grid-cols-1 md:grid-cols-[240px_1fr] bg-gradient-to-b from-[#f8fbff] to-white text-gray-900">
			<aside className="hidden md:block border-r border-white/60 bg-white/70 backdrop-blur-md">
				<nav className="p-4 space-y-2 text-sm">
					<h2 className="px-2 text-xs uppercase tracking-wider text-gray-500">Admin</h2>
					<NavLink to="/mimin" className={({ isActive }) => `block rounded-lg px-3 py-2 ${isActive ? 'bg-[#0588d9] text-white' : 'hover:bg-white'}`}>Dashboard</NavLink>
					<NavLink to="/mimin/books" className={({ isActive }) => `block rounded-lg px-3 py-2 ${isActive ? 'bg-[#0588d9] text-white' : 'hover:bg-white'}`}>Books</NavLink>
					<NavLink to="/mimin/books/new" className={({ isActive }) => `block rounded-lg px-3 py-2 ${isActive ? 'bg-[#0588d9] text-white' : 'hover:bg-white'}`}>Add Book</NavLink>
					<NavLink to="/mimin/users" className={({ isActive }) => `block rounded-lg px-3 py-2 ${isActive ? 'bg-[#0588d9] text-white' : 'hover:bg-white'}`}>Users</NavLink>
					<NavLink to="/mimin/authors" className={({ isActive }) => `block rounded-lg px-3 py-2 ${isActive ? 'bg-[#0588d9] text-white' : 'hover:bg-white'}`}>Authors</NavLink>
					<NavLink to="/mimin/analytics" className={({ isActive }) => `block rounded-lg px-3 py-2 ${isActive ? 'bg-[#0588d9] text-white' : 'hover:bg-white'}`}>Analytics</NavLink>
				</nav>
			</aside>
			<section className="flex flex-col min-h-screen">
				<header className="sticky top-0 z-30 border-b border-white/60 bg-white/70 backdrop-blur-md h-14 flex items-center px-4">
					<div className="font-semibold">Admin Panel</div>
				</header>
				<main className="flex-1 container mx-auto px-4 py-6">
					<Outlet />
				</main>
			</section>
		</div>
	);
}
