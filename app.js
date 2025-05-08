const express=require('express')
const cors = require('cors')
const cookieParser=require('cookie-parser')

const connectToDB = require('./db')
const authRoutes = require('./routes/auth.routes.js')
const userRoutes = require('./routes/user.routes.js')

const app=express()
const PORT=process.env.PORT || 5500

connectToDB();

const corsOptions = {
    origin: 'http://localhost:5173',
    credentials: true,
}


app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

//Fix payload size limit for large images
app.use(express.json({limit: "10mb", extended: true}))
app.use(express.urlencoded({limit: "10mb", extended: true, parameterLimit: 50000}))

app.use('/auth', authRoutes)
app.use('/user', userRoutes)

app.listen(PORT, ()=>console.log(`Listening on port ${PORT}`))