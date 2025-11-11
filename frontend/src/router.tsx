/* @refresh reset */
import { createBrowserRouter } from 'react-router-dom';
import { lazy, Suspense, type JSX } from 'react';
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';
import ProtectedRoute from './components/layout/ProtectedRoute';
import AdminProtectedRoute from './components/layout/AdminProtectedRoute';

const HomePage = lazy(() => import('./pages/Home/HomePage'));
const BooksListPage = lazy(() => import('./pages/Books/BooksListPage'));

const BookDetailPage = lazy(() => import('./pages/Books/BookDetailPage'));
const GenreListPage = lazy(() => import('./pages/Books/GenreListPage'));
const FavoritesPage = lazy(() => import('./pages/Books/FavoritesPage'));
const CartPage = lazy(() => import('./pages/Cart/CartPage'));
const QuotePage = lazy(() => import('./pages/Cart/QuotePage'));
const QuoteConfirmPage = lazy(() => import('./pages/Cart/QuoteConfirmPage'));
const LoginPage = lazy(() => import('./pages/Auth/LoginPage'));
const RegisterPage = lazy(() => import('./pages/Auth/RegisterPage'));
const ProfilePage = lazy(() => import('./pages/User/ProfilePage'));
const OrdersPage = lazy(() => import('./pages/User/OrdersPage'));
const OrderDetailPage = lazy(() => import('./pages/User/OrderDetailPage'));
const DashboardPage = lazy(() => import('./pages/Admin/DashboardPage'));
const AdminBooksPage = lazy(() => import('./pages/Admin/BooksPage'));
const AddBookPage = lazy(() => import('./pages/Admin/AddBookPage'));
const EditBookPage = lazy(() => import('./pages/Admin/EditBookPage'));
const UsersPage = lazy(() => import('./pages/Mimin/MiminUsersPage'));
const AuthorsPage = lazy(() => import('./pages/Mimin/MiminAuthorsPage'));
const AnalyticsPage = lazy(() => import('./pages/Admin/AnalyticsPage'));
const AboutPage = lazy(() => import('./pages/Static/AboutPage'));
const ContactPage = lazy(() => import('./pages/Static/ContactPage'));
const PrivacyPage = lazy(() => import('./pages/Static/PrivacyPage'));
const TermsPage = lazy(() => import('./pages/Static/TermsPage'));
const NotFoundPage = lazy(() => import('./pages/Static/NotFoundPage'));

const withFallback = (el: JSX.Element) => (
	<Suspense fallback={<div className="p-6 text-gray-500">Loading...</div>}>{el}</Suspense>
);

// Create router function to avoid Fast Refresh warning
function createRouter() {
	return createBrowserRouter([
	{
		path: '/',
		element: <MainLayout />,
		children: [
			{ index: true, element: withFallback(<BooksListPage />) },
			{ path: 'books', element: withFallback(<BooksListPage />) },
			{ path: 'books/:id', element: withFallback(<BookDetailPage />) },
			{ path: 'books/genre/:id', element: withFallback(<GenreListPage />) },
			{ path: 'cart', element: withFallback(<CartPage />) },
			{ path: 'quote', element: withFallback(<QuotePage />) },
			{ path: 'quote/confirm', element: withFallback(<QuoteConfirmPage />) },
			{ path: 'auth/login', element: withFallback(<LoginPage />) },
			{ path: 'auth/register', element: withFallback(<RegisterPage />) },
			{ path: 'about', element: withFallback(<AboutPage />) },
			{ path: 'contact', element: withFallback(<ContactPage />) },
			{ path: 'privacy', element: withFallback(<PrivacyPage />) },
			{ path: 'terms', element: withFallback(<TermsPage />) },
			{
				path: 'me',
				element: <ProtectedRoute />,
				children: [
					{ index: true, element: withFallback(<ProfilePage />) },
					{ path: 'orders', element: withFallback(<OrdersPage />) },
					{ path: 'orders/:id', element: withFallback(<OrderDetailPage />) },
				],
			},
			{
				path: 'favorites',
				element: <ProtectedRoute />,
				children: [
					{ index: true, element: withFallback(<FavoritesPage />) },
				],
			},
		],
	},
	{
		path: '/mimin',
		element: <AdminProtectedRoute />,
		children: [
			{
				path: '',
				element: <AdminLayout />,
				children: [
					{ index: true, element: withFallback(<DashboardPage />) },
					{ path: 'books', element: withFallback(<AdminBooksPage />) },
					{ path: 'books/new', element: withFallback(<AddBookPage />) },
					{ path: 'books/:id/edit', element: withFallback(<EditBookPage />) },
					{ path: 'users', element: withFallback(<UsersPage />) },
					{ path: 'authors', element: withFallback(<AuthorsPage />) },
					{ path: 'analytics', element: withFallback(<AnalyticsPage />) },
				],
			},
		],
	},
	{ path: '*', element: withFallback(<NotFoundPage />) },
	]);
}

export const router = createRouter();
