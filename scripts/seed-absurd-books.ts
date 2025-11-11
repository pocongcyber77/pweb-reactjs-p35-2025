import { prisma } from '../src/prisma/client';
import { Prisma } from '@prisma/client';

function choice<T>(arr: readonly T[]): T {
	return arr[Math.floor(Math.random() * arr.length)];
}

function randInt(min: number, max: number): number {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randPrice(min: number, max: number): number {
	const v = Math.random() * (max - min) + min;
	return Math.round(v / 500) * 500; // round to nearest 500
}

function generateAbsurdTitle(): string {
	const keywords = [
		'brainrot','kuliner','horor','konspirasi','jawa','receh','ketololan',
		'spam','ngawi','santet','komedi','romansa','mistis','teknologi','nasi padang',
		'kucing','gacor','merinding','pikun','waswas','waras','ambyar','wedhus','kopi',
		'bakso','malam','siang','gadungan','toxic','healing','santuy','gibah','plot twist'
	];
	const nWords = randInt(2, 4);
	const words: string[] = [];
	for (let i = 0; i < nWords; i++) {
		words.push(choice(keywords));
	}
	// Capitalize first letters and join with spaces, ensure extra absurd suffix sometimes
	const title = words.map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
	const suffixes = [' Deluxe', ' Ultimate', ' Banget', ' Kronik', '', '', ' ++'];
	return title + choice(suffixes);
}

function generateAbsurdAuthor(): string {
	const firsts = ['Mas','Mbak','Kang','Mimin','Lord','Bapak','Bu','Ki','Mbah','Masbro','Sultan','Ratu','Om','Auntie'];
	const lasts = ['Brainrot','Receh','Ketololan','Konspirasi','Horor','Wedhus','Sate','Kucing','Gacor','Pikun','Ambigu','Amburadul','Semesta','Ambarrukmo'];
	return `${choice(firsts)} ${choice(lasts)}`;
}

function generatePublisher(): string {
	const pubs = ['Penerbit Absurd', 'Rumah Wedhus', 'Konspirasi Media', 'Receh Corp', 'Horor Press', 'Kuliner Nusantara', 'Studio Ngawi', 'Kopi & Kata'];
	return choice(pubs);
}

async function main() {
	console.log('🔧 Seeding 36 absurd books...');
	const genres = await prisma.genre.findMany({ select: { id: true, name: true } });
	if (genres.length === 0) {
		throw new Error('No genres found. Please seed genres first.');
	}

	const conditions = ['Baru','Bekas','Berkarat','Berjamur','Kroak','Hilang'] as const;

	const payloads: Prisma.BookCreateInput[] = Array.from({ length: 36 }).map(() => {
		const title = generateAbsurdTitle();
		const writer = generateAbsurdAuthor();
		const publisher = generatePublisher();
		const publication_year = randInt(1995, new Date().getFullYear());
		const price = randPrice(10000, 250000);
		const stock_quantity = randInt(0, 200);
		const condition = Math.random() < 0.85 ? choice(conditions) : null; // sometimes null
		const genre = choice(genres);

		return {
			title,
			writer,
			publisher,
			publication_year,
			description: 'Buku dummy ultra-absurd hasil seed otomatis.',
			cover_url: null,
			price,
			stock_quantity,
			condition: condition as any,
			created_at: new Date(),
			updated_at: new Date(),
			genre: { connect: { id: genre.id } },
		};
	});

	let created = 0;
	for (const data of payloads) {
		try {
			await prisma.book.create({ data });
			created++;
		} catch (e: any) {
			// Skip duplicate titles, regenerate title once then retry
			if (e?.code === 'P2002') {
				const retry = { ...data, title: generateAbsurdTitle() };
				await prisma.book.create({ data: retry });
				created++;
			} else {
				console.error('Failed to create a book:', e?.message || e);
			}
		}
	}

	console.log(`✅ Seed complete. Inserted: ${created} books`);
}

main()
	.catch((e) => {
		console.error('❌ Seed error:', e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});


