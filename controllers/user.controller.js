const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User.js');
const Post = require('../models/Post.js');

const uploadPost = async (req, res, next) => {
    const { title, body } = req.body;
    try {
        const user=req.user;

        const newPost=new Post({title, body});

        await newPost.save();

        user.posts.push(newPost._id);
        await user.save();
        
        res.status(201).json({ message: "Post uploaded successfully", post: newPost });
    } catch (error) {
        next(error);
    }
}

module.exports = uploadPost;

