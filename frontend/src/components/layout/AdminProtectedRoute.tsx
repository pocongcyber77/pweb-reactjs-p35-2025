import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function AdminProtectedRoute() {
	const { token, user, loading } = useAuth();
	const location = useLocation();

	if (loading) {
		return <div className="p-6 text-gray-500">Loading...</div>;
	}

	// Check if user is logged in
	if (!token) {
		return <Navigate to="/auth/login" replace state={{ from: location }} />;
	}

	// Check if user has admin role
	const allowedRoles = ['Admin', 'Presiden', 'Dewa'];
	const userRole = user?.role;

	if (!userRole || !allowedRoles.includes(userRole)) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-center">
					<h1 className="text-3xl font-bold text-red-600 mb-4">Access Denied</h1>
					<p className="text-gray-600 mb-4">
						You don't have permission to access this page.
					</p>
					<p className="text-sm text-gray-500 mb-6">
						Only users with Admin, Presiden, or Dewa role can access the admin panel.
					</p>
					<a 
						href="/books" 
						className="inline-block rounded-xl bg-[#0588d9] text-white px-6 py-2 hover:opacity-90"
					>
						Go to Home
					</a>
				</div>
			</div>
		);
	}

	return <Outlet />;
}

