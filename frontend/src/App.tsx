import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { LoginModalProvider } from './contexts/LoginModalContext';

export default function App() {
	return (
		<LoginModalProvider>
			<RouterProvider router={router} />
		</LoginModalProvider>
	);
}
