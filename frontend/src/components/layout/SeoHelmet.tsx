import { useEffect } from 'react';

interface SeoHelmetProps { title: string; description?: string; canonical?: string }
export default function SeoHelmet({ title, description, canonical }: SeoHelmetProps) {
	useEffect(() => {
		document.title = title;
		if (description) {
			let meta = document.querySelector('meta[name="description"]');
			if (!meta) { meta = document.createElement('meta'); meta.setAttribute('name','description'); document.head.appendChild(meta); }
			meta.setAttribute('content', description);
		}
		if (canonical) {
			let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
			if (!link) { link = document.createElement('link'); link.setAttribute('rel','canonical'); document.head.appendChild(link); }
			link.setAttribute('href', canonical);
		}
	}, [title, description, canonical]);
	return null;
}
