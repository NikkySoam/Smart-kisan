import mongoose, {
  Schema,
  Document,
} from "mongoose";

export interface IFarmer
  extends Document {
  name: string;
  phone?: string;
  village?: string;
  user: mongoose.Types.ObjectId;
}

const farmerSchema =
  new Schema<IFarmer>(
    {
      name: {
        type: String,
        required: true,
      },

      phone: {
        type: String,
      },

      village: {
        type: String,
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

export default mongoose.model<IFarmer>(
  "Farmer",
  farmerSchema
);