import mongoose, { Schema,Document } from "mongoose";

export interface ICrop
  extends Document {
  name: string;
  season: string;
  area: number;
  user: mongoose.Types.ObjectId;
}

const cropSchema =
  new Schema<ICrop>(
    {
      name: {
        type: String,
        required: true,
      },

      season: {
        type: String,
        required: true,
      },

      area: {
        type: Number,
        required: true,
      },

      user: {
        type:
          mongoose.Schema.Types
            .ObjectId,

        ref: "User",

        required: true,
      },
    },
    {
      timestamps: true,
    }
  );

export default mongoose.model<ICrop>( "Crop", cropSchema );