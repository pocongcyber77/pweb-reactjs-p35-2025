import { Outlet } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

export default function MainLayout() {
	return (
		<div className="flex flex-col min-h-screen bg-gradient-to-b from-[#f8fbff] to-white text-gray-900">
			<Header />
			<main className="flex-1 container mx-auto px-4 py-6">
				<Outlet />
			</main>
			<Footer />
		</div>
	);
}
