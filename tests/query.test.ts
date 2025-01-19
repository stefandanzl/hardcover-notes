// tests/graphql.test.ts
import { describe, it, expect } from '@jest/globals';

//@ts-nocheck
import { GraphQLClient } from 'graphql-request';


describe('GraphQL Integration Tests', () => {
    const client = new GraphQLClient(process.env.API_URL!, {
        headers: {
            authorization: 'Bearer ${process.env.API_KEY}'
        }
    })

    it('should fetch user books', async () => {
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
        
        console.log('Sending query:', query)
        const result = await client.request(query)
        console.log('Received response:', JSON.stringify(result, null, 2))
        
        // Basic validation that we got some data
        expect(result).toBeDefined()
        // expect(result.user).toBeDefined()
    }, 10000) // Increased timeout for real network requests
})