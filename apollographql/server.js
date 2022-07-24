const express = require('express')
const {ApolloServer} = require('apollo-server-express')
const typeDefs = require('./typeDefs')
const resolvers = require('./resolvers')
const mongoose = require('mongoose')



async function startSever() {
    const app = express()
    const apolloServer = new ApolloServer({
        typeDefs: typeDefs,
        resolvers: resolvers
    })

    // start apollo server before listening to app on any port
    await apolloServer.start()  

    apolloServer.applyMiddleware({app: app})

    app.use((req, res) => {
        res.send('Hello from express apollo server')
    })

    app.listen(4000, () =>  console.log('Server is running on port 4000'))

    await mongoose.connect('mongodb://localhost:27017/post_db', {
        useUnifiedTopology: true,
        useNewUrlParser: true
    })
}
console.log('Mongoose conntected...')

startSever();