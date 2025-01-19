import { Book, User } from "const";
import * as Mustache  from "mustache"

// Function to parse and process the data
export function processUserBooks(data: { me: User[] }) {

    const user = data.me[0];
    const processedBooks = user.user_books.map(userBook => ({
        title: userBook.book.title,
        filename: sanitizeTitle(userBook.book.title),
        author: userBook.book.contributions[0].author.name,
        readDate: {
            start: userBook.user_book_reads[0].started_at,
            end: userBook.user_book_reads[0].finished_at
        },
        cover: userBook.book.image.url,
        description: userBook.book.description,
        status: userBook.user_book_status.status,
    }));

    return {
        username: user.username,
        books: processedBooks as unknown as Book[],
    };

}


export function sanitizeTitle(title: string): string {
    return title
        // Replace invalid characters with alternatives or remove them
        .replace(/[\/\\:]/g, '-')     // Replace slashes and colons with dash
        .replace(/[*"<>|?]/g, '')     // Remove other invalid characters
        .replace(/\s+/g, ' ')         // Replace multiple spaces with single space
        .replace(/^\s+|\s+$/g, '')    // Trim spaces from start and end
        .replace(/\./g, '_')          // Replace dots with underscore
        .replace(/\s/g, '_')          // Replace spaces with underscore
        .substring(0, 255);           // Limit length to 255 characters
}


