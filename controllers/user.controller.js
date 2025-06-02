const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User.js');
const Post = require('../models/Post.js');
const { uploadToCloudinary, deleteFromCloudinary } = require('../services/cloudinary.js');

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

const fetchUserPosts = async (req, res, next) => {
    try {
        const posts = await Post.find({ user: req.user._id }).populate('user', 'username email');
        res.status(200).json(posts);
      } catch (err) {
        next(err);
      }
 }

const fetchImages = async (req, res, next) => {
    try {
        retrieveFromCloudinary(req.params.publicId);
        res.status(200).json({ message: "Image retrieved successfully" });
    } catch (error) {
        next(error);
    }
}

const deletePostById = async (req, res, next) => {
    const postId = req.params.id;
    try {
        const post = await Post.findById(postId);
        if (!post) return res.status(404).json({ message: "Post not found" });

        if (post.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "You are not authorized to delete this post" });
        }

        if(post.image?.publicId){
            await deleteFromCloudinary(post.image.publicId);
        }

        await Post.findByIdAndDelete(postId);
        res.status(200).json({ message: "Post deleted successfully" });
    } catch (error) {
        next(error);
    }
}

const editPost = async (req, res, next) => {
      try {
    const { id } = req.params;
    const { title, body, category } = req.body;
    const userId = req.user.id;

    if (!title || !body || !category) {
      return res.status(400).json({ 
        error: 'Title, body, and category are required' 
      });
    }

    if (!['Lost', 'Found'].includes(category)) {
      return res.status(400).json({ 
        error: 'Category must be either "Lost" or "Found"' 
      });
    }

    const post = await Post.findById(id);
    
    if (!post) {
      return res.status(404).json({ 
        error: 'Post not found' 
      });
    }

    if (post.user.toString() !== userId.toString()) {
      return res.status(403).json({ 
        error: 'You can only edit your own posts' 
      });
    }

    const updatedPost = await Post.findByIdAndUpdate(
      id,
      {
        title: title.trim(),
        body: body.trim(),
        category,
        updatedAt: new Date()
      },
      { 
        new: true, 
        runValidators: true 
      }
    ).populate('user', 'username email'); 

    res.status(200).json({
      message: 'Post updated successfully',
      post: updatedPost
    });

  } catch (error) {

    next(error);
  }
}

module.exports = { uploadPost, fetchPosts, fetchUserPosts, deletePostById, editPost };

