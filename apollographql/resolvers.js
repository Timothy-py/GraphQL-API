const Post = require('./models/post')

const resolvers = {
    Query: {
        hello: () => {
            return 'Hello World'
        },
        getAllPosts: async () => {
            return await Post.find();
        }
    }
}

module.exports = resolvers