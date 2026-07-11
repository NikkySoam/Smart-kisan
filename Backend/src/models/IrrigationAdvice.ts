import mongoose, { Schema, Document } from "mongoose";

export interface IIrrigationAdvice extends Document {
  user: mongoose.Types.ObjectId;
  field: mongoose.Types.ObjectId;
  crop: string;
  weatherSnapshot: {
    temp: number;
    humidity: number;
    condition: string;
    windSpeed: number;
  };
  aiResult: {
    needsWater: boolean;
    urgency: string;
    recommendedWithinHours: number;
    waterRequirement: string;
    reason: string;
    recommendation: string;
    tips: string[];
  };
  createdAt: Date;
  updatedAt: Date;
}

const irrigationAdviceSchema = new Schema<IIrrigationAdvice>(
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
    crop: {
      type: String,
      required: true,
    },
    weatherSnapshot: {
      temp: { type: Number, required: true },
      humidity: { type: Number, required: true },
      condition: { type: String, required: true },
      windSpeed: { type: Number, required: true },
    },
    aiResult: {
      needsWater: { type: Boolean, required: true },
      urgency: { type: String, required: true },
      recommendedWithinHours: { type: Number, required: true },
      waterRequirement: { type: String, required: true },
      reason: { type: String, required: true },
      recommendation: { type: String, required: true },
      tips: [{ type: String }],
    },
  },
  {
    timestamps: true,
  }
);

// Indexes to speed up queries by field and creation date
irrigationAdviceSchema.index({ field: 1, createdAt: -1 });

export default mongoose.model<IIrrigationAdvice>("IrrigationAdvice", irrigationAdviceSchema);
