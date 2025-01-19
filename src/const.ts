

export interface MyPluginSettings {
	mySetting: string;
    authBearer: string;
    apiUrl: string;
}


export const DEFAULT_SETTINGS: MyPluginSettings = {
	mySetting: 'default',
    authBearer: '',
    apiUrl: 'https://hardcover-hasura-production-1136269bb9de.herokuapp.com/v1/graphql'
}



export interface Author {
    name: string;
}

export interface Contribution {
    author: Author;
}

export interface Image {
    url: string;
}

export interface Book {
    id: number;
    title: string;
    subtitle: string;
    release_year: number;
    description: string;
    alternative_titles: string[];
    contributions: Contribution[];
    image: Image;
}

export interface BookRead {
    started_at: string;
    paused_at: string | null;
    finished_at: string;
}

export interface BookStatus {
    status: string;
    id: number;
}

export interface UserBook {
    book_id: number;
    book: Book;
    user_book_status: BookStatus;
    user_book_reads: BookRead[];
}

export interface User {
    username: string;
    user_books: UserBook[];
}