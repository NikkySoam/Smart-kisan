import mongoose, { Schema, Document } from "mongoose";

export interface ICropSaleReceipt extends Document {
  user: mongoose.Types.ObjectId;
  field: mongoose.Types.ObjectId;
  buyerName: string;
  date: Date;
  quantity: number;
  pricePerQuintal: number;
  totalAmount: number;
  notes: string;
}

const cropSaleReceiptSchema = new Schema<ICropSaleReceipt>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    field: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Field",
      required: true,
    },
    buyerName: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    quantity: {
      type: Number,
      required: true,
    },
    pricePerQuintal: {
      type: Number,
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    notes: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<ICropSaleReceipt>("CropSaleReceipt", cropSaleReceiptSchema);
