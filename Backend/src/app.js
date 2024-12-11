import express from 'express'
import cors from 'cors'
const app = express();

// importing routes
import healthCheckRouter from './routes/healthCheck.route.js'

app.use(cors({
        origin : process.env.CORS_URL,
        Credentials : true
    }))

app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:true , limit : "16kb"}))
app.use(express.static("public"))

// routing
console.log("before call")
app.use('/api/v1/healthcheck',healthCheckRouter);

export {
    app
}