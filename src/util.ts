/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-useless-escape */
import { User } from "const";
const diff_match_patch = require("diff-match-patch");

export function processUserBooks(data: { me: User[] }) {
	const user = data.me[0];
	const processedBooks = user.user_books.map((userBook) => {
		// Parse authors into array
		const authors = userBook.book.contributions
			?.map((contribution) => contribution?.author?.name)
			.filter((name): name is string => name != null) ?? [
			"Unknown Author",
		];

		// Convert status ID to string status
		const statusId = userBook.user_book_status?.id ?? 0;
		let status: string;
		switch (statusId) {
			case 1:
				status = "to-read";
				break;
			case 2:
				status = "reading";
				break;
			case 3:
				status = "read";
				break;
			default:
				status = "unknown";
		}

		return {
			author: authors,
			bookStatus: status,
			bookStatusId: statusId,
			dateFinished: userBook.user_book_reads?.[0]?.finished_at ?? null,
			dateStarted: userBook.user_book_reads?.[0]?.started_at ?? null,
			description: userBook.book.description ?? "",
			filename: sanitizeTitle(userBook.book.title ?? "Untitled"),
			imageurl: userBook.book.image?.url ?? "",
			releaseYear: userBook.book.release_year ?? 0,
			subtitle: userBook.book.subtitle ?? "",
			title: userBook.book.title ?? "Untitled",
		};
	});

	return processedBooks;
}

export function sanitizeTitle(title: string): string {
	return (
		title
			// Replace invalid characters with alternatives or remove them
			.replace(/[\/\\:]/g, "-") // Replace slashes and colons with dash
			.replace(/[*"<>|?]/g, "") // Remove other invalid characters
			.replace(/\s+/g, " ") // Replace multiple spaces with single space
			.replace(/^\s+|\s+$/g, "") // Trim spaces from start and end
			.replace(/\./g, "_") // Replace dots with underscore
			// .replace(/\s/g, '_')          // Replace spaces with underscore
			.substring(0, 255)
	); // Limit length to 255 characters
}

export function log(...text: unknown[]) {
	const loggean = true;
	if (loggean) {
		console.log(text);
	}
}

export function diffMerger(originalContent: string, newContent: string): string {
	const dmp = new diff_match_patch();

	// Find what changed in new version
	const newVersionDiffs = dmp.diff_main(originalContent, newContent);
	console.log(newVersionDiffs)
	dmp.diff_cleanupSemantic(newVersionDiffs);

	// Create patches but ONLY for deletions (to restore original content)
	const preservePatches = dmp.patch_make(
		newVersionDiffs
		//@ts-ignore
			.filter(([operation]) => operation === -1) // Only keep deletions
			//@ts-ignore
			.map(([operation, text]) => [operation * -1, text])
	); // Convert deletions to additions

	// Apply these patches to new version to restore original content
	const [restoredContent] = dmp.patch_apply(preservePatches, newContent);

	// console.log(restoredContent);

	return restoredContent;
}
