import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './assets/styles/tailwind.css';
import './assets/styles/tokens.css';
import './assets/styles/glass.css';
import App from './App';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<QueryClientProvider client={queryClient}>
			<AuthProvider>
				<CartProvider>
					<App />
				</CartProvider>
			</AuthProvider>
		</QueryClientProvider>
	</React.StrictMode>,
);
