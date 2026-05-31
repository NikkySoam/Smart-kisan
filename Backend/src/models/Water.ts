import mongoose, {
  Schema,
  Document,
} from "mongoose";

export interface Water extends Document {
  farmer: mongoose.Types.ObjectId;
  hours: number;
  date: Date;
  totalAmount: number;
  user: mongoose.Types.ObjectId;
}

const waterSchema = new Schema<Water>(
  {
    farmer: {
     type: mongoose.Schema.Types.ObjectId,
     ref: "Farmer",
     required: true,
    },

    hours: {
      type: Number,
      required: true,
    },

    date: {
      type: Date,
      required: true,
    },

    totalAmount: {
      type: Number,
      required: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<Water>(
  "Water",
  waterSchema
);