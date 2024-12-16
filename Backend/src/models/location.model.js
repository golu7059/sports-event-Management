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
        validate:{
            validator: function(pin){
                return pin.toSting().length === 6;
            },
            message : "pin code must be of 6 digits"
        }
    }
})  

export const Location = mongoose.model("Location",locationSchema)