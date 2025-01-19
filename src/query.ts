import { GraphQLClient } from 'graphql-request'

const client = new GraphQLClient('https://hardcover-hasura-production-1136269bb9de.herokuapp.com/v1/graphql', {
    headers: {
        authorization: 'Bearer your_token_here'
    }
})

async function fetchUserBooks(userId: number) {
    const query = `
        query {
            user(id: ${userId}) {
                user_books(
                    where: {
                        user_book_reads: {
                            finished_at: {
                                _gt: "2024-01-01"
                                _lt: "2025-12-31"
                            }
                        }
                    }
                ) {
                    book {
                        title
                        pages
                    }
                    user_book_reads(limit: 1) {
                        finished_at
                    }
                }
            }
        }
    `
    
    return await client.request(query)
}