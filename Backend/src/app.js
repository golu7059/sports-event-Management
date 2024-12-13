import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'


const app = express();

// error handler:  
import errorHandler from './middlewares/error.middleware.js';

// importing routes
import healthCheckRouter from './routes/healthCheck.route.js'
import userRouter from './routes/user.route.js'

app.use(cors({
        origin : process.env.CORS_URL,
        credentials : true
    }))

app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:true , limit : "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())

// routing
app.use('/api/v1/healthcheck',healthCheckRouter);
app.use('/api/v1/users',userRouter)
app.use(errorHandler)

export {
    app
}