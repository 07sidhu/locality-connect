import mongoose, { Schema, Model } from "mongoose";

// 1. Interface
export interface ISociety {
  name: string;
  address: string;
}

// 2. Schema
const SocietySchema = new Schema<ISociety>(
  {
    name: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// 3. Model (The fix is here: we ensure we don't compile it twice)
const Society = mongoose.models.Society || mongoose.model<ISociety>("Society", SocietySchema);

export default Society;