import mongoose, { Schema, Document } from "mongoose";

export interface IPost extends Document {
  content: string;
  type: "ANNOUNCEMENT" | "GENERAL";
  authorName: string;
  authorId: mongoose.Schema.Types.ObjectId;
  societyId: mongoose.Schema.Types.ObjectId;
}

const PostSchema = new Schema<IPost>(
  {
    content: { type: String, required: true },
    imageUrl: { type: String }, // <--- NEW FIELD
    type: {
      type: String,
      enum: ["ANNOUNCEMENT", "GENERAL"],
      default: "GENERAL",
    },
    authorName: { type: String, required: true }, // Storing name to avoid complex lookups
    authorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    societyId: { type: mongoose.Schema.Types.ObjectId, ref: "Society", required: true },
  },
  { timestamps: true }
);

export const Post = mongoose.models.Post || mongoose.model<IPost>("Post", PostSchema);