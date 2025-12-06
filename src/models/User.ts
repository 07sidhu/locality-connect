import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: "RESIDENT" | "ADMIN" | "GUARD";
  societyId: mongoose.Schema.Types.ObjectId;
  flatNumber?: string;
  isVerified: boolean; // <--- NEW FIELD
}

const UserSchema: Schema<IUser> = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["RESIDENT", "ADMIN", "GUARD"],
      default: "RESIDENT",
    },
    societyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Society",
      required: true,
    },
    flatNumber: { type: String },
    // By default, new users are NOT verified (Pending Approval)
    isVerified: { type: Boolean, default: false }, 
  },
  { timestamps: true }
);

const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;