import {GraphQLClient} from "graphql-request"


const client = new GraphQLClient(process.env.API_URL, {
    headers: {
        authorization: 'Bearer ${process.env.API_KEY}'
    }
})


    const query = `
        query {
            user(id: 25085) {
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
                    }
                    user_book_reads(limit: 1) {
                        finished_at
                    }
                }
            }
        }
    `

    const response = await client.request(query)

    console.log(response)