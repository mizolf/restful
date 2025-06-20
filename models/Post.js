const mongoose=require('mongoose')

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    body: {
        type: String,
        required: true,
    },
    image:{
        publicId:{
            type: String,
            required: true,
        },
        url: {
            type: String,
            required: true,
        }
    },
    category: {
        type: String,
        enum: ['Lost', 'Found'],
        default: 'Lost',
        required: true
    },
    user: {
        type:mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }
}, { timestamps: true });

const Post = mongoose.model('Post', postSchema);

module.exports = Post;