const express=require('express')
const { authenticate } = require('../middleware/auth.middleware.js');
const { uploadPost, fetchPosts } = require('../controllers/user.controller.js');

const userRouter=express.Router()

userRouter.get('/posts', fetchPosts);

userRouter.get('/profile', authenticate, (req, res)=>{
    res.json({ message: `Welcome ${req.user.username}`});
});


userRouter.post('/post', authenticate, uploadPost);

userRouter.post('/logout', (req, res) => {
    res.clearCookie('token');
    res.json({ message: 'Logged out successfully' });
});

module.exports = userRouter;