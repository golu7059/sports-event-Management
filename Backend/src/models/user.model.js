import mongoose,{Schema} from "mongoose";

const userSchema = new Schema({
    username : {
        type : String,
        required : true,
        unique : true,
        trim : true,
        lowercase : true,
        index : true
    },
    fullName : {
        type : String,
        required : true,
        trim : true,
    },
    email : {
        type : String,
        required : true,
        unique : true,
        trim : true,
        lowercase : true,
        typeof : email,
    },
    gender : {
        type : String,
        required : true
    },
    phoneNo : {
        type : Number,
        required : true
    },
    avatar : {
        type : String,
        required : true
    },
    coverImage : {
        type : String
    },
    matchHistory : [
        {
            type : Schema.Types.ObjectId,
            ref : "Match"
        }
    ],
    password : {
        type : String,
        required : [true, "Password is required !"] 
    },
    refreshToken : {
        type : String,
    },
},{
    timestamps : true       // mongoose maintain created at and updated at
})

export const User = mongoose.model("User",userSchema)
