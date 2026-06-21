import mongoose, { Schema, Document } from "mongoose";

export interface IFieldWater extends Document {
  field: mongoose.Types.ObjectId;
  hours: number;
  date: Date;
  user: mongoose.Types.ObjectId;
}

const fieldWaterSchema =
  new Schema<IFieldWater>(
    {
      field: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Field",
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

export default mongoose.model<IFieldWater>( "FieldWater",fieldWaterSchema );