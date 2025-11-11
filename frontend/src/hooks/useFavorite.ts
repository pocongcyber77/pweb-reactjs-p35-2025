import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLoginModal } from '../contexts/LoginModalContext';
import { api } from '../utils/http';

export function useFavorite(bookId: string | undefined) {
	const { token } = useAuth();
	const { openModal } = useLoginModal();
	const [isFavorited, setIsFavorited] = useState(false);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (!bookId || !token) {
			setIsFavorited(false);
			return;
		}

		// Check favorite status
		api.get(`/favorites/check/${bookId}`, {
			headers: { Authorization: `Bearer ${token}` },
		})
			.then((res) => setIsFavorited(res.data?.isFavorited || false))
			.catch(() => setIsFavorited(false));
	}, [bookId, token]);

	const toggleFavorite = useCallback(async () => {
		if (!bookId || !token) {
			openModal();
			return;
		}

		setLoading(true);
		try {
			if (isFavorited) {
				await api.delete(`/favorites/${bookId}`, {
					headers: { Authorization: `Bearer ${token}` },
				});
				setIsFavorited(false);
			} else {
				await api.post('/favorites', { book_id: bookId }, {
					headers: { Authorization: `Bearer ${token}` },
				});
				setIsFavorited(true);
			}
		} catch (e: any) {
			const errorMsg = e?.response?.data?.error || e?.response?.data?.message || 'Gagal mengupdate favorit';
			alert(errorMsg);
		} finally {
			setLoading(false);
		}
	}, [bookId, token, isFavorited, openModal]);

	return { isFavorited, toggleFavorite, loading };
}

