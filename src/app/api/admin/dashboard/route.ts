import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { Ticket } from "@/models/Ticket"; 
import User from "@/models/User";         
import { cookies } from "next/headers";
import jwt, { JwtPayload } from "jsonwebtoken";

// ✅ 1. Define what is inside the Token
interface DecodedToken extends JwtPayload {
  userId: string;
  role: string;
}

// Helper: Check if the requester is actually an ADMIN
async function getAdminUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token");

  if (!token) return null;

  try {
    // ✅ 2. Use the Interface instead of 'any'
    const decoded = jwt.verify(token.value, process.env.JWT_SECRET!) as DecodedToken;
    
    if (decoded.role !== "ADMIN") return null; 
    return decoded;
  } catch (e) {
    return null;
  }
}

export async function GET() {
  try {
    await connectDB();
    
    // 1. Security Check
    const admin = await getAdminUser();
    if (!admin) {
      return NextResponse.json({ message: "Access Denied" }, { status: 401 });
    }

    // 2. Fetch All Data
    const tickets = await Ticket.find()
      .populate("userId", "name") 
      .sort({ createdAt: -1 });

    const users = await User.find()
      .select("-password") 
      .sort({ createdAt: -1 });

    return NextResponse.json({ tickets, users });

  } catch (error) {
    // ✅ 3. Safely handle unknown error types
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    
    return NextResponse.json(
      { message: "Server Error", error: errorMessage },
      { status: 500 }
    );
  }
}