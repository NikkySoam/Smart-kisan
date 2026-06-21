import mongoose, {Schema,Document } from "mongoose";
 
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

  farmerSchema.index({
  name: 1,
  user: 1,
});

export default mongoose.model<IFarmer>("Farmer",farmerSchema);