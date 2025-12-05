import mongoose, { Schema, Document } from "mongoose";

export interface ITicket extends Document {
  title: string;
  description: string;
  category: string;
  status: string;
  userId: mongoose.Schema.Types.ObjectId;
  societyId: mongoose.Schema.Types.ObjectId;
}

const TicketSchema = new Schema<ITicket>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: {
      type: String,
      enum: ["PLUMBING", "ELECTRICAL", "CLEANLINESS", "SECURITY", "OTHER"],
      default: "OTHER",
    },
    status: {
      type: String,
      enum: ["OPEN", "IN_PROGRESS", "RESOLVED"],
      default: "OPEN",
    },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    societyId: { type: mongoose.Schema.Types.ObjectId, ref: "Society", required: true },
  },
  { timestamps: true }
);

// This line is crucial. It exports the model so other files can use it.
export const Ticket = mongoose.models.Ticket || mongoose.model<ITicket>("Ticket", TicketSchema);