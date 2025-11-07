import { createContext, useContext, useMemo, useReducer } from 'react';

export interface CartItem { bookId: string; title: string; price: number; quantity: number }

type Action =
	| { type: 'add'; item: CartItem }
	| { type: 'remove'; bookId: string }
	| { type: 'update'; bookId: string; quantity: number }
	| { type: 'clear' };

function reducer(state: CartItem[], action: Action): CartItem[] {
	switch (action.type) {
		case 'add': {
			const idx = state.findIndex((i) => i.bookId === action.item.bookId);
			if (idx >= 0) {
				const next = [...state];
				next[idx] = { ...next[idx], quantity: next[idx].quantity + action.item.quantity };
				return next;
			}
			return [...state, action.item];
		}
		case 'remove':
			return state.filter((i) => i.bookId !== action.bookId);
		case 'update':
			return state.map((i) => (i.bookId === action.bookId ? { ...i, quantity: action.quantity } : i));
		case 'clear':
			return [];
		default:
			return state;
	}
}

interface CartState {
	items: CartItem[];
	subtotal: number;
	add: (item: CartItem) => void;
	remove: (bookId: string) => void;
	update: (bookId: string, quantity: number) => void;
	clear: () => void;
}

const CartContext = createContext<CartState | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
	const [items, dispatch] = useReducer(reducer, [], () => {
		try { return JSON.parse(localStorage.getItem('cart') || '[]'); } catch { return []; }
	});

	const value = useMemo(() => {
		const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
		localStorage.setItem('cart', JSON.stringify(items));
		return {
			items,
			subtotal,
			add: (item: CartItem) => dispatch({ type: 'add', item }),
			remove: (bookId: string) => dispatch({ type: 'remove', bookId }),
			update: (bookId: string, quantity: number) => dispatch({ type: 'update', bookId, quantity }),
			clear: () => dispatch({ type: 'clear' }),
		};
	}, [items]);

	return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
	const ctx = useContext(CartContext);
	if (!ctx) throw new Error('useCart must be used within CartProvider');
	return ctx;
}
