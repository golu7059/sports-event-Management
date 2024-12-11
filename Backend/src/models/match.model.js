import mongoose,{Schema} from 'mongoose'

const matchSchema = new Schema({
    location : {
        type : Schema.Types.ObjectId,
        ref : "Location",
        required : true
    },
    category : {
        type : String,
        required : true,
        default : "Cricket"
    },
    numberOfPlayers : {
        type : Number,
        required : true,
        default : 11
    },
    time: {
        type : Date
    },
    isPaid : {
        type : Boolean,
        required : true, 
        default : false
    },
    organiser : {
        type : Schema.Types.ObjectId,
        ref : "User"
    },
    paymentOptions : {
        type : Array
    }
},{
    timestamps : true
})

export const Match = mongoose.model("Match",matchSchema);