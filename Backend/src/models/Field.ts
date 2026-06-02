import mongoose, {
  Schema,
  Document,
} from "mongoose";

export interface IField
  extends Document {
  name: string;

  area: number;

  location: string;

  crop: string;

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
        required: true,
      },

      location: {
        type: String,
        default: "",
      },

      crop: {
        type: String,
        default: "",
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

export default mongoose.model<IField>(
  "Field",
  fieldSchema
);