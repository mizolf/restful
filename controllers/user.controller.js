const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User.js');
const Post = require('../models/Post.js');
const { uploadToCloudinary } = require('../services/cloudinary.js');

const uploadPost = async (req, res, next) => {
    const { title, body, category, image } = req.body;
    try {

        let imageData = {}
        if(image) {
            const results = await uploadToCloudinary(image, "my-posts");
            imageData = results;
        }

        if(!title || !body) return res.status(400).json({ message: "Title and body are required." });

        const user=req.user;
        if(!user) return res.status(401).json({message: 'Unauthorized'});

        const newPost=new Post({title, body, category, image: imageData, user: user._id});

        await newPost.save();

        user.posts.push(newPost._id);
        await user.save();
        
        res.status(201).json({ message: "Post uploaded successfully", post: newPost });
    } catch (error) {
        next(error);
    }
}

const fetchPosts = async (req, res, next) => {
    try {
        const posts = await Post.find().populate('user', 'username email');
        res.status(200).json(posts);
    } catch (error) {
        next(error);
    }
}

module.exports = { uploadPost, fetchPosts };

