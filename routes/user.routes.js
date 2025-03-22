const express=require('express')
const { authenticate } = require('../middleware/auth.middleware.js');
const uploadPost = require('../controllers/user.controller.js');

const userRouter=express.Router()

userRouter.get('/profile', authenticate, (req, res)=>{
    res.json({ message: `Welcome ${req.user.username}`});
});

userRouter.post('/post', authenticate, uploadPost);

module.exports = userRouter;