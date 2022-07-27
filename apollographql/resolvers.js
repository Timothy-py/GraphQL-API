const Post = require('./models/post')

const resolvers = {
    Query: {
        hello: () => {
            return 'Hello World'
        },
        getAllPosts: async () => {
            return await Post.find();
        },
        getPost: async (parent, {id}, context, info) => {
            return await Post.findById(id)
        }
    },

    Mutation: {
        createPost: async (parent, args, context, info) => {
            const {title, description} = args.post
            const post = new Post({title, description})
            await post.save()
            return post;
        }
    }
}

module.exports = resolvers