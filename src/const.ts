export interface NewBook {
	author: string;
	bookStatus: string;
	bookStatusId: number;
	dateFinished: string | null;
	dateStarted: string | null;
	description: string | null;
	filename: string;
	imageurl: string | null;
	releaseYear: number;
	subtitle: string;
	title: string;
}

export type BookKey = keyof NewBook;

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
	filename: string;
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

export const DEFAULT_TEMPLATE: string = `
![cover|150]({{imageurl}})
# {{title}}

## {{subtitle}}

{{description}}
`;


export interface PropSet {
    enabled: boolean,
    alias: string,
}

// export interface PropertySettings {
//     bookStatus: PropSet;
//     bookStatusId: PropSet;
//     releaseYear: PropSet;
//     imageurl: PropSet;
//     title: PropSet;
//     subtitle: PropSet;
//     filename: PropSet;
//     description: PropSet;
//     dateStarted: PropSet;
//     dateFinished: PropSet;
//     author: PropSet;
//     }

export interface PropertySettings {
    bookStatus: string;
    bookStatusId: string;
    releaseYear: string;
    imageurl: string;
    title: string;
    subtitle: string;
    filename: string;
    description: string;
    dateStarted: string;
    dateFinished: string;
    author: string;
    }
   
// export const DEFAULT_PROPERTYSET = {
//     bookStatus: {
//         alias: "bookStatus",
//         enabled: true,
//     },
//     bookStatusId: {
//         alias: "bookStatusId", 
//         enabled: true,
//     },
//     releaseYear: {
//         alias: "releaseYear",
//         enabled: true,
//     },
//     imageurl: {
//         alias: "imageurl",
//         enabled: true,
//     },
//     title: {
//         alias: "title",
//         enabled: true,
//     },
//     subtitle: {
//         alias: "subtitle", 
//         enabled: true,
//     },
//     filename: {
//         alias: "filename",
//         enabled: true,
//     },
//     description: {
//         alias: "description",
//         enabled: true,
//     },
//     dateStarted: {
//         alias: "dateStarted",
//         enabled: true,
//     },
//     dateFinished: {
//         alias: "dateFinished",
//         enabled: true,
//     },
//     author: {
//         alias: "author",
//         enabled: true,
//     }
//  }

export const DEFAULT_PROPERTYSET = {
    bookStatus: "bookStatus",
    bookStatusId: "bookStatusId",
    releaseYear: "releaseYear",
    imageurl: "imageurl",
    title: "title",
    subtitle: "subtitle",
    filename: "filename", 
    description: "description",
    dateStarted: "dateStarted",
    dateFinished: "dateFinished",
    author: "author"
 }

 export const DEFAULT_DIRECTORY = "Hardcover"

 
export interface MyPluginSettings {
    filter: string;
	overwriteFrontmatter: boolean;
	authBearer: string;
	apiUrl: string;
	directory: string;
	templateContent: string;
	properties: (keyof NewBook)[];
    propertySet: PropertySettings;
    overwriteContent: boolean;
}

export const DEFAULT_SETTINGS: MyPluginSettings = {
	authBearer: "",
	apiUrl: "https://hardcover-hasura-production-1136269bb9de.herokuapp.com/v1/graphql",
	directory: DEFAULT_DIRECTORY,
	templateContent: DEFAULT_TEMPLATE,
	properties: ["title", "author", "dateFinished"],
    propertySet: DEFAULT_PROPERTYSET,
    overwriteContent: true,
    overwriteFrontmatter: true,
    filter: `user_book_reads: {finished_at: {_gt: "2022-01-01", _lt: "2025-12-31"}}, 
        #user_book_status: {id: {_eq: 3}}`
};