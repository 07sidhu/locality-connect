import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { MarketplaceItem } from "@/models/MarketplaceItem"; // Named Import
import { cookies } from "next/headers";
import jwt, { JwtPayload } from "jsonwebtoken";

// Define what the Token looks like
interface DecodedToken extends JwtPayload {
  userId: string;
  name: string;
  role: string;
}

// Helper to check login
async function getUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token");
  if (!token) return null;
  try {
    return jwt.verify(token.value, process.env.JWT_SECRET!) as DecodedToken;
  } catch (e) { return null; }
}

// 1. GET: Fetch all available items
export async function GET() {
  try {
    await connectDB();
    // Fetch only items that are not sold yet
    const items = await MarketplaceItem.find({ status: "AVAILABLE" }).sort({ createdAt: -1 });
    return NextResponse.json({ items });
  } catch (error) {
    return NextResponse.json({ message: "Error fetching market" }, { status: 500 });
  }
}

// 2. POST: List a new item for sale
export async function POST(req: Request) {
  try {
    await connectDB();
    
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { title, price, description, contactPhone, societyId } = body;

    const newItem = await MarketplaceItem.create({
      title,
      price,
      description,
      sellerName: user.name, // Auto-fill seller name from token
      sellerPhone: contactPhone,
      sellerId: user.userId,
      societyId,
    });

    return NextResponse.json({ message: "Item Listed", item: newItem }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Error listing item" }, { status: 500 });
  }
}