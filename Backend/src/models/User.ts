import mongoose, {
  Schema,
  Document,
} from "mongoose";

export interface User extends Document {
  name: string;
  phone: string;
  pin: string;
  waterRate: number;
  city: string
}

const userSchema = new Schema<User>(
  {
    name: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
      required: true,
      unique: true,
    },

    pin: {
      type: String,
      required: true,
    },

    waterRate: {
      type: Number,
      default: 150,
    },

    city: {
    type: String,
    default: "Gurgaon",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<User>(
  "User",
  userSchema
);