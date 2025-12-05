import mongoose, { Schema, Document } from "mongoose";

export interface IService extends Document {
  name: string;
  role: string;
  phoneNumber: string;
  societyId: mongoose.Schema.Types.ObjectId;
}

const ServiceSchema = new Schema<IService>(
  {
    name: { type: String, required: true },
    role: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    societyId: { type: mongoose.Schema.Types.ObjectId, ref: "Society", required: true },
  },
  { timestamps: true }
);

// ✅ THE CRITICAL EXPORT LINE
export const Service = mongoose.models.Service || mongoose.model<IService>("Service", ServiceSchema);