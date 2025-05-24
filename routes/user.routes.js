const express=require('express')
const { authenticate } = require('../middleware/auth.middleware.js');
const { uploadPost, fetchPosts, fetchUserPosts } = require('../controllers/user.controller.js');
const { retrieveFromCloudinary } = require('../services/cloudinary.js');

const userRouter=express.Router()

userRouter.get('/posts', fetchPosts);

userRouter.get('/my-posts', authenticate, fetchUserPosts);

userRouter.get('/profile', authenticate, (req, res)=>{
    res.json({
        username: req.user.username,
        email: req.user.email,
        createdAt: req.user.createdAt});
});


userRouter.post('/post', authenticate, uploadPost);

userRouter.get('/images/:publicId', async (req, res) => {
    const { publicId } = req.params;
    try {
        const imageUrl = retrieveFromCloudinary(publicId);
        res.json({ imageUrl });  // šalje URL slike nazad klijentu
    } catch (err) {
        res.status(500).json({ error: 'Greška prilikom dobijanja slike' });
    }
});

userRouter.post('/logout', (req, res) => {
    res.clearCookie('token');
    res.json({ message: 'Logged out successfully' });
});

module.exports = userRouter;