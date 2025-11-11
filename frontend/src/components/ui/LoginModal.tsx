interface LoginModalProps {
	isOpen: boolean;
	onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
			<div className="bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full mx-4 border border-gray-200" onClick={(e) => e.stopPropagation()}>
				<div className="flex justify-between items-center mb-4">
					<h2 className="text-2xl font-bold text-[#0588d9] font-heading">Login Diperlukan</h2>
					<button
						onClick={onClose}
						className="text-gray-400 hover:text-gray-600 transition-colors"
						aria-label="Tutup"
					>
						<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
						</svg>
					</button>
				</div>
				<p className="text-gray-600 mb-6">
					Silakan login terlebih dahulu untuk menggunakan fitur ini. Jika belum punya akun, silakan daftar terlebih dahulu.
				</p>
				<div className="flex flex-col sm:flex-row gap-3">
					<button
						onClick={() => {
							onClose();
							window.location.href = '/auth/login';
						}}
						className="flex-1 bg-[#0588d9] text-white px-4 py-2 rounded-xl hover:bg-[#0470b8] transition-colors font-semibold font-heading"
					>
						Login
					</button>
					<button
						onClick={() => {
							onClose();
							window.location.href = '/auth/register';
						}}
						className="flex-1 bg-white border-2 border-[#0588d9] text-[#0588d9] px-4 py-2 rounded-xl hover:bg-[#0588d9]/5 transition-colors font-semibold font-heading"
					>
						Daftar
					</button>
				</div>
			</div>
		</div>
	);
}

