import mongoose, { Schema, Document } from "mongoose";

export interface IMarketplaceItem extends Document {
  title: string;
  price: number;
  description: string;
  sellerName: string;
  sellerPhone: string;
  sellerId: mongoose.Schema.Types.ObjectId;
  societyId: mongoose.Schema.Types.ObjectId;
  status: "AVAILABLE" | "SOLD";
}

const MarketplaceItemSchema = new Schema<IMarketplaceItem>(
  {
    title: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    imageUrl: { type: String }, // <--- NEW FIELD
    sellerName: { type: String, required: true },
    sellerPhone: { type: String, required: true }, 
    sellerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    societyId: { type: mongoose.Schema.Types.ObjectId, ref: "Society", required: true },
    status: { type: String, enum: ["AVAILABLE", "SOLD"], default: "AVAILABLE" },
  },
  { timestamps: true }
);

// Named Export
export const MarketplaceItem = 
  mongoose.models.MarketplaceItem || 
  mongoose.model<IMarketplaceItem>("MarketplaceItem", MarketplaceItemSchema);