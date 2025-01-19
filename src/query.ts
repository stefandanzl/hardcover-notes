import { GraphQLClient } from 'graphql-request'
import MyPlugin from 'main'
import { User } from 'const';
import { processUserBooks } from './util';


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
    return processUserBooks(response);
}




}