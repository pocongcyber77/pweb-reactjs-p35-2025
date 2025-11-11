import { createContext, useContext, useState, ReactNode } from 'react';
import LoginModal from '../components/ui/LoginModal';

interface LoginModalContextType {
	openModal: () => void;
	closeModal: () => void;
}

const LoginModalContext = createContext<LoginModalContextType | undefined>(undefined);

export function LoginModalProvider({ children }: { children: ReactNode }) {
	const [isOpen, setIsOpen] = useState(false);

	const openModal = () => setIsOpen(true);
	const closeModal = () => setIsOpen(false);

	return (
		<LoginModalContext.Provider value={{ openModal, closeModal }}>
			{children}
			<LoginModal isOpen={isOpen} onClose={closeModal} />
		</LoginModalContext.Provider>
	);
}

export function useLoginModal() {
	const context = useContext(LoginModalContext);
	if (!context) {
		throw new Error('useLoginModal must be used within LoginModalProvider');
	}
	return context;
}

