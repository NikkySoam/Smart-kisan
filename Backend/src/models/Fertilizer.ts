import mongoose, {
  Schema,
  Document,
} from "mongoose";

export interface IFertilizer
  extends Document {
  field: mongoose.Types.ObjectId;

  fertilizerName: string;

  quantity: number;

  cost: number;

  date: Date;

  user: mongoose.Types.ObjectId;
}

const fertilizerSchema =
  new Schema<IFertilizer>(
    {
      field: {
        type:
          mongoose.Schema.Types
            .ObjectId,

        ref: "Field",

        required: true,
      },

      fertilizerName: {
        type: String,
        required: true,
      },

      quantity: {
        type: Number,
        required: true,
      },

      cost: {
        type: Number,
        required: true,
      },

      date: {
        type: Date,
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

export default mongoose.model<IFertilizer>(
  "Fertilizer",
  fertilizerSchema
);