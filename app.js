const express=require('express')
const cors = require('cors')
const cookieParser=require('cookie-parser')

const connectToDB = require('./db')
const authRoutes = require('./routes/auth.routes.js')
const userRoutes = require('./routes/user.routes.js')

const app=express()
const PORT=process.env.PORT || 5500

connectToDB();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use('/auth', authRoutes)
app.use('/user', userRoutes)

app.listen(PORT, ()=>console.log(`Listening on port ${PORT}`))