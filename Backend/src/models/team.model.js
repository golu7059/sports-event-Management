
import mongoose,{Schema} from "mongoose";

const teamSchema = new Schema({
    name : {
        type : String,
        required : true,
        unique : true,
        trim : true,
        lowercase : true,
        index : true
    },
    cateogery : {
        type : String,
        required : true
    },
    members : [
        {
            type : Schema.Types.ObjectId,
            ref : "User"
        }
    ],
    teamLeader : {
        type : Schema.Types.ObjectId,
        ref : "User"
    },
    matchId : {
        type : Schema.Types.ObjectId,
        ref : "Match"
    }
})

export default mongoose.model("Team",teamSchema)