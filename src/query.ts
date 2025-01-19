import { GraphQLClient } from "graphql-request";
import MyPlugin from "main";
import { User } from "const";
import { processUserBooks } from "./util";

export class Client extends GraphQLClient {
	plugin: MyPlugin;

	constructor(plugin: MyPlugin) {
		super(plugin.settings.apiUrl, {
			headers: {
				authorization: plugin.settings.authBearer,
			},
		});
		this.plugin = plugin;
	}

	async fetchUserBooks() {
		const query = `
       query ListCurrentBooks {
  me {
    username
    user_books(
      where: {
      ${this.plugin.settings.filter}
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
    `;

		const response = (await this.plugin.client.request(query)) as {
			me: User[];
		};
		return processUserBooks(response);
	}
}
