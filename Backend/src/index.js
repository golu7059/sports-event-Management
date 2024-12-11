import {app} from './app.js'
import dotenv from 'dotenv'
import connectDB from './db/dbConnection.js'

dotenv.config({
    path : './.env'
})

const PORT = process.env.PORT || 5000


connectDB().then(() => {
app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
})
}).catch((e) => {
    console.log("Ooops ! Something wents's wrong ",e)
})

