import { Book, NewBook, User } from "const";

// import * as Mustache  from "mustache"
const he = require('he');

// Function to parse and process the data
export function processUserBooks(data: { me: User[] }) {

    const user = data.me[0];
    const processedBooks = user.user_books.map(userBook  => ({
        author: userBook.book.contributions[0].author.name,
        bookStatus: userBook.user_book_status.status,
        bookStatusId: userBook.user_book_status.id,
        dateFinished: userBook.user_book_reads[0].finished_at,
        dateStarted: userBook.user_book_reads[0].started_at,
        description: he.decode(userBook.book.description),
        filename: sanitizeTitle(he.decode(userBook.book.title)),
        imageUrl: userBook.book.image.url,
        releaseYear: userBook.book.release_year,
        subtitle: he.decode(userBook.book.subtitle),
        title: he.decode(userBook.book.title),
    }));

    console.log(processedBooks)

    return  processedBooks
    

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


export function log(text: string | string[] | any | any[]) {
    if (true) {
        console.log(text);
    }
}