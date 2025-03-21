const express=require('express')
const { authenticate } = require('../middleware/auth.middleware.js')

const userRouter=express.Router()

userRouter.get('/profile', authenticate, (req, res)=>{
    res.json({ message: `Welcome ${req.user.username}`});
});

userRouter.post('/post', authenticate, (req, res)=>{
    res.json({ message: `User: ${req.user.username} has posted a blog`});
});

module.exports = userRouter;