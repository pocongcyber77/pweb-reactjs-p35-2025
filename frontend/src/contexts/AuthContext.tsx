import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../utils/http';

export interface User {
	id: string;
	email: string;
	username?: string;
	role?: 'guest' | 'user' | 'admin';
}

interface AuthState {
	token: string | null;
	user: User | null;
	loading: boolean;
	login: (email: string, password: string) => Promise<void>;
	register: (email: string, password: string, username?: string) => Promise<void>;
	logout: () => void;
}

const AuthContext = createContext<AuthState | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState<boolean>(!!token);

	useEffect(() => {
		if (!token) return;
		setLoading(true);
		api.get('/auth/me')
			.then((res) => setUser(res.data?.data || res.data))
			.catch(() => {
				setUser(null);
				setToken(null);
				localStorage.removeItem('token');
			})
			.finally(() => setLoading(false));
	}, [token]);

	const login = useCallback(async (email: string, password: string) => {
		const res = await api.post('/auth/login', { email, password });
		const t = res.data?.data?.token || res.data?.token;
		const u = res.data?.data?.user || res.data?.user;
		if (t) {
			localStorage.setItem('token', t);
			setToken(t);
		}
		if (u) setUser(u);
	}, []);

	const register = useCallback(async (email: string, password: string, username?: string) => {
		const res = await api.post('/auth/register', { email, password, username });
		const t = res.data?.data?.token || res.data?.token;
		const u = res.data?.data?.user || res.data?.user;
		if (t) {
			localStorage.setItem('token', t);
			setToken(t);
		}
		if (u) setUser(u);
	}, []);

	const logout = useCallback(() => {
		localStorage.removeItem('token');
		setToken(null);
		setUser(null);
	}, []);

	const value = useMemo(() => ({ token, user, loading, login, register, logout }), [token, user, loading, login, register, logout]);
	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
	const ctx = useContext(AuthContext);
	if (!ctx) throw new Error('useAuth must be used within AuthProvider');
	return ctx;
}
