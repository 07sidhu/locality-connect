import mongoose, { Schema, Document } from "mongoose";

export interface ITicket extends Document {
  title: string;
  description: string;
  category: string;
  status: string;
  userId: mongoose.Schema.Types.ObjectId;
  societyId: mongoose.Schema.Types.ObjectId;
  assignedTo?: string; // <--- NEW: Name of the staff assigned
}

const TicketSchema = new Schema<ITicket>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, default: "OTHER" },
    status: { type: String, enum: ["OPEN", "IN_PROGRESS", "RESOLVED"], default: "OPEN" },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    societyId: { type: mongoose.Schema.Types.ObjectId, ref: "Society", required: true },
    assignedTo: { type: String }, // <--- NEW FIELD
    imageUrl: { type: String },
  },
  { timestamps: true }
);

export const Ticket = mongoose.models.Ticket || mongoose.model<ITicket>("Ticket", TicketSchema);