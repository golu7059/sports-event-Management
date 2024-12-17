import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const matchSchema = new Schema(
  {
    location: {
      type: Schema.Types.ObjectId,
      ref: "Location",
      required: true,
    },
    category: {
      type: String,
      required: true,
      default: "Cricket",
    },
    numberOfPlayers: {
      type: Number,
      required: true,
      default: 11,
    },
    teams: [
      {
        type: Schema.Types.ObjectId,
        ref: "Team",
      },
    ],
    time: {
      type: Date,
    },
    isPaid: {
      type: Boolean,
      required: true,
      default: false,
    },
    organiser: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required : true
    },
    paymentOptions: {
      type: Array,
    },
  },
  {
    timestamps: true,
  }
);

matchSchema.plugin(mongooseAggregatePaginate);
export const Match = mongoose.model("Match", matchSchema);
