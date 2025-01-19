import { GraphQLClient } from 'graphql-request'
import MyPlugin from 'main'
import { User } from 'const';


export class Client extends GraphQLClient{
    plugin: MyPlugin

constructor(plugin: MyPlugin){
    super(plugin.settings.apiUrl,  {
        headers: {
            authorization: plugin.settings.authBearer
        }
    })
this.plugin = plugin;
}

async fetchUserBooks() {
    const query = `
       query ListCurrentBooks {
  me {
    username
    user_books(
      where: {
        user_book_reads: {finished_at: {_gt: "2024-01-01", _lt: "2025-12-31"}}, 
        #user_book_status: {id: {_eq: 3}}
            }
    ) {
      user_book_status {
        status
        id
      }
      book_id
      book {
        id
        release_year
        image {
          url
        }
        title
        subtitle
        alternative_titles
        description
        contributions {
          author {
            name
          }
        }
      }
      user_book_reads {
        started_at
        paused_at
        finished_at
      }
    }
  }
}
    `
    
    const response = await this.plugin.client.request(query) as {me: User[]}
    return this.processUserBooks(response);
}

// Function to parse and process the data
processUserBooks(data: { me: User[] }) {

    const user = data.me[0];
    const processedBooks = user.user_books.map(userBook => ({
        title: userBook.book.title,
        author: userBook.book.contributions[0].author.name,
        readDate: {
            start: userBook.user_book_reads[0].started_at,
            end: userBook.user_book_reads[0].finished_at
        },
        cover: userBook.book.image.url,
        description: userBook.book.description,
        status: userBook.user_book_status.status
    }));

    return {
        username: user.username,
        books: processedBooks
    };

}


}