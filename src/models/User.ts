import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  role: "RESIDENT" | "ADMIN" | "GUARD";
  societyId: mongoose.Schema.Types.ObjectId; // Link to Society
  flatNumber?: string; // Optional for now
  password: string;
}

const UserSchema: Schema<IUser> = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: {
      type: String,
      enum: ["RESIDENT", "ADMIN", "GUARD"],
      default: "RESIDENT",
    },
    societyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Society", // This links the User to a specific Society Table
      required: true,
    },
    flatNumber: { type: String },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;