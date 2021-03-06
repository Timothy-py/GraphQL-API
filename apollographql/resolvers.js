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
        },

        deletePost: async (parent, {id}, context, info) => {
            await Post.findByIdAndDelete(id)
            return "Post deleted successfully"
        },

        updatePost: async (parent, args, context, info) => {
            const {id} = args
            const {title, description} = args.post
            const update = {}
            if(title != undefined){
                update.title = title
            }
            if(description != undefined){
                update.description = description
            }
            const post = await Post.findByIdAndUpdate(id, update, {new: true})

            return post
        }
    }
}

module.exports = resolvers