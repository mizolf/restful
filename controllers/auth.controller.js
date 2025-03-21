const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User.js');

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
        
        res.json({ token });
    } catch (error) {
        next(error);
    }
} 

module.exports = { register, login };