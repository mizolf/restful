const mongoose=require('mongoose')
const bcrypt=require('bcrypt');
const Post = require('./Post.js');

const userSchema = new mongoose.Schema({
    username: {
        type: String, 
        required: true, 
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
      },
    posts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    }]
}, {timestamps: true});

userSchema.methods.comparePassword = async function (password) {
    return bcrypt.compare(password, this.password);
}

const User = mongoose.model('User', userSchema);

module.exports = User;