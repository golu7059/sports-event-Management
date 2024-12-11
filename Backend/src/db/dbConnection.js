import mongoose from 'mongoose'

const connectDB = async () => {
    try {
        const connectionInstance =await mongoose.connect(`${process.env.MONGODB_URI}`)
        console.log((`MongoDB connected ! host Name : ${connectionInstance.connection.host}`));
    } catch (error) {
        console.log("MongoDB Connection error : " , error);
        process.exit(1);        
    }
}

export default connectDB