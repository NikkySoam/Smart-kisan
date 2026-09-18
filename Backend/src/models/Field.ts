import mongoose, { Schema, Document } from "mongoose";

export interface IField
  extends Document {
  name: string;
  area: number;
  location: string;
  crop: string;
  imageUrl: string;
  cloudinaryPublicId: string;
  lastWaterReminderFor?: mongoose.Types.ObjectId;
  lastFertilizerReminderFor?: mongoose.Types.ObjectId;
  cropSellingPrice: number;
  user: mongoose.Types.ObjectId;
}

const fieldSchema =
  new Schema<IField>(
    {
      name: {
        type: String,
        required: true,
      },

      area: {
        type: Number,
        default: 0
      },

      location: {
        type: String,
        default: "",
      },

      crop: {
        type: String,
        default: "Crop name"
      },

      imageUrl: {
        type: String,
        default: "",
      },

      cloudinaryPublicId: {
        type: String,
        default: "",
      },
      lastWaterReminderFor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "FieldWater",
        default: null,
      },
      lastFertilizerReminderFor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Fertilizer",
        default: null,
      },
      cropSellingPrice: {
        type: Number,
        default: 0,
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

export default mongoose.model<IField>( "Field",fieldSchema );
