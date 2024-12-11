
import mongoose,{Schema} from "mongoose";

const paymentSchema = new Schema({
    match : {
        type : Schema.Types.ObjectId,
        ref : "Match"
    },
    amount : {
        type : Number,
        required : true
    },
    paymetDate: {
        type : Date
    },
    paymentId : {
        type : String,
        required : true
    },
    paymentMethod : {
        type : String,
        required : true
    },
    PaymentStatus : {
        type : String,
        required : true
    }
},
{
    timestamps : true
})

export default mongoose.model("Payment",paymentSchema)