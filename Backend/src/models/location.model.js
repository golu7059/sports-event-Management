import mongoose,{Schema} from "mongoose";

const locationSchema = new Schema({
  
    address : {
        type : String,
        required : true,
        trim : true
    },
    city : {
        type : String,
        required : true,
        trim : true
    },
    state : {
        type : String,
        required : true,
        trim : true
    },
    pincode : {
        type : Number,
        required : true,
        trim : true
    }
})  

export default mongoose.model("Location",locationSchema)