const express = require('express');
const {graphqlHTTP} = require('express-graphql');

const {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLList,
    GraphQLNonNull,
    GraphQLInt,
    GraphQLString
} = require('graphql')

const app = express()

const authors = [
    {"id":1,"name":"Genna"},
    {"id":2,"name":"Bevon"},
    {"id":3,"name":"Theobald"},
    {"id":4,"name":"Denney"},
    {"id":5,"name":"Skyler"}
]
const books = [
    {"id":1,"name":"augue vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae donec pharetra magna vestibulum","authorId":1},
    {"id":2,"name":"vehicula condimentum curabitur in libero ut massa volutpat convallis morbi odio odio elementum eu interdum eu tincidunt in leo","authorId":2},
    {"id":3,"name":"mi nulla ac enim in tempor turpis nec euismod scelerisque quam turpis adipiscing lorem vitae mattis nibh ligula nec sem","authorId":3},
    {"id":4,"name":"fermentum donec ut mauris eget massa tempor convallis nulla neque libero convallis eget eleifend luctus ultricies eu","authorId":4},
    {"id":5,"name":"ac nibh fusce lacus purus aliquet at feugiat non pretium quis lectus","authorId":5},
    {"id":6,"name":"blandit lacinia erat vestibulum sed magna at nunc commodo placerat praesent blandit nam nulla integer pede justo lacinia eget tincidunt","authorId":4},
    {"id":7,"name":"nunc proin at turpis a pede posuere nonummy integer non","authorId":3},
    {"id":8,"name":"nec condimentum neque sapien placerat ante nulla justo aliquam quis turpis eget elit sodales scelerisque","authorId":1},
    {"id":9,"name":"donec ut mauris eget massa tempor convallis nulla neque libero convallis eget eleifend luctus ultricies eu","authorId":1},
    {"id":10,"name":"suspendisse accumsan tortor quis turpis sed ante vivamus tortor duis mattis egestas metus aenean fermentum","authorId":3}
]

// const schema = new GraphQLSchema({
//     query: new GraphQLObjectType({
//         name: 'HelloWorld',
//         fields: () => ({
//             message: {
//                 type: GraphQLString,
//                 resolve: () => "Hello World"
//             }
//         })
//     })
// })
const BookType = new GraphQLObjectType({
    name: 'Book',
    description: 'This represents a book written by an author',
    fields: () => ({
        id: {type: GraphQLNonNull(GraphQLInt)},
        name: {type: GraphQLNonNull(GraphQLString)},
        authorId: {type: GraphQLNonNull(GraphQLInt)},
        author: {
            type: AuthorType,
            resolve: (book) => {
                return authors.find(author => author.id === book.authorId)
            }
        }
    })
})

const AuthorType = new GraphQLObjectType({
    name: 'Author',
    description: 'This represents an author of a book',
    fields: () => ({
        id: {type: GraphQLNonNull(GraphQLInt)},
        name: {type: GraphQLNonNull(GraphQLString)},
        books: {
            type: GraphQLList(BookType),
            resolve: (author) => {
                return books.filter(book => book.authorId === author.id)
            }
        }
    })
})

const RootQueryType = new GraphQLObjectType({
    name: 'Query',
    description: 'Root Query',
    fields: () => ({
        books: {
            type: new GraphQLList(BookType),
            description: 'List of All Books',
            resolve: () => books
        },
        authors: {
            type: new GraphQLList(AuthorType),
            description: 'List of All Authors',
            resolve: () => authors
        },
        book: {
            type: BookType,
            description: 'A book object',
            args: {
                id: {type: GraphQLNonNull(GraphQLInt)}
            },
            resolve: (book, args) => {
                return books.find(book => args.id === book.id)
            }
        },
        author: {
            type: AuthorType,
            description: 'An Author object',
            args: {
                id: {type: GraphQLNonNull(GraphQLInt)}
            },
            resolve: (author, args) => {
                return authors.find(author => args.id === author.id)
            }
        }
    }),
})

const RootMutationType = new GraphQLObjectType({
    name: 'Mutation',
    description: 'Root Mutation',
    fields: () => ({
        addBook: {
            type: BookType,
            description: 'Add a book',
            args: {
                name: {type: GraphQLNonNull(GraphQLString)},
                authorId: {type: GraphQLNonNull(GraphQLInt)}
            },
            resolve: (parent, args) => {
                const book = {
                    id: books.length + 1,
                    name: args.name,
                    authorId: args.authorId
                }
                books.push(book)
                return book
            }
        }
    })
})

const schema = new GraphQLSchema({
    query: RootQueryType,
    mutation: RootMutationType
})


app.use('/graphql', graphqlHTTP({
    graphiql: true,
    schema: schema
}))

app.listen(7000, ()=>{
    console.log('Server is running on PORT:7000')
})