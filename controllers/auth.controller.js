const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User.js');
const express = require('express');

const register  = async (req, res, next) => {
    const { username, email, password} =req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({username, email, password: hashedPassword});

        await user.save();
    } catch (error) {
        next(error);
    }
}  

const login  = async (req, res, next) => {
    const { username, password} =req.body;
    try {
        const user= await User.findOne({ username })

        if(!user) return res.status(404).json({ message: 'User not found.' });

        const passwordMatch = await user.comparePassword(password);

        if(!passwordMatch) return res.status(401).json({ message: 'Password does not match.' });

        const token = jwt.sign({userId: user._id}, process.env.JWT_SECRET_KEY, { expiresIn: '2h' });

        res.cookie('token', token, { 
            httpOnly: true, 
            secure: true, 
            sameSite: 'Strict', 
            maxAge: 2 * 60 * 60 * 1000
        });
        
        res.json({ message: "Login successful" });
    } catch (error) {
        next(error);
    }
} 

module.exports = { register, login };