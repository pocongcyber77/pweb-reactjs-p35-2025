export default function Footer() {
	return (
		<footer className="mt-12 border-t border-white/60 bg-white/60 backdrop-blur-md">
			<div className="container mx-auto px-4 py-6 text-sm text-slate-600">
				<p>© {new Date().getFullYear()} IT Literature Shop</p>
			</div>
		</footer>
	);
}
