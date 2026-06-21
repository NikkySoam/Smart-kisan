import mongoose, { Schema, Document } from "mongoose";

export interface ICropScan
  extends Document {
  user: mongoose.Types.ObjectId;
  crop: string;
  problem: string;
  symptoms: string[];
  medicine: string[];
  advice: string[];
}

const cropScanSchema =
  new Schema(
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },

      imageUrl: {
        type: String,
        required: true,
        },

      cloudinaryPublicId: {
        type: String,
        required: true,
        },

      crop: {
        type: String,
        required: true,
      },

      problem: {
        type: String,
        required: true,
      },

      symptoms: [String],

      medicine: [String],

      advice: [String],
    },
    {
      timestamps: true,
    }
  );

export default mongoose.model( "CropScan", cropScanSchema );