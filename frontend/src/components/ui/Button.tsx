import { type ButtonHTMLAttributes } from 'react';
import cn from 'classnames';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> { variant?: 'primary' | 'ghost' }
export default function Button({ className, variant = 'primary', ...props }: ButtonProps) {
	return (
		<button
			className={cn(
				'inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm transition',
				{
					'bg-[#0588d9] text-white shadow-glass hover:opacity-90': variant === 'primary',
					'bg-white/70 border border-white/60 backdrop-blur-md hover:bg-white': variant === 'ghost',
				},
				className,
			)}
			{...props}
		/>
	);
}
