import mongoose,{Schema} from "mongoose";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

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

// password encryption
mongoose.pre("save",async function(next){
    if(!this.modified("password")) return next();
    bcrypt.hash(this.password , 10);
    next();
})

// adding methods 
userSchema.methods.isCorrectPassword = async function (enteredPassword){
    return await bcrypt.compare(this.password,enteredPassword);
}

userSchema.methods.generateAccessToken = function(){
    const payload = {
        _id : this._id,
        name : this.fullName,
        email : this.email
    }
    return jwt.sign(payload,process.env.ACCESS_TOKEN_KEY,{expiresIn:process.env.ACCESS_TOKEN_EXPIREIN})
}

userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id : this._id
        },
        REFRESH_TOKEN_KEY ,
        {
            expiresIn : REFRESH_TOKEN_EXPIREIN
        }
    )
}

export const User = mongoose.model("User",userSchema)
