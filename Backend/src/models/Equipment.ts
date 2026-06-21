import mongoose, { Schema, Document } from "mongoose";

export interface IEquipment
  extends Document {
  field: mongoose.Types.ObjectId;
  equipmentName: string;
  amount: number;
  date: Date;
  user: mongoose.Types.ObjectId;
}

const equipmentSchema =
  new Schema<IEquipment>(
    {
      field: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Field",
        required: true,
      },

      equipmentName: {
        type: String,
        required: true,
      },

      amount: {
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

export default mongoose.model<IEquipment>( "Equipment", equipmentSchema );