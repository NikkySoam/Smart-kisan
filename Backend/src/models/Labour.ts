import mongoose, {
  Schema,
  Document,
} from "mongoose";

export interface ILabour
  extends Document {
  field: mongoose.Types.ObjectId;

  amount: number;

  workType: string;

  date: Date;

  user: mongoose.Types.ObjectId;
}

const labourSchema =
  new Schema<ILabour>(
    {
      field: {
        type:
          mongoose.Schema.Types
            .ObjectId,

        ref: "Field",

        required: true,
      },

      amount: {
        type: Number,
        required: true,
      },

      workType: {
        type: String,
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

export default mongoose.model<ILabour>(
  "Labour",
  labourSchema
);