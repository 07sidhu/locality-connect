import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { cookies } from "next/headers";
import jwt, { JwtPayload } from "jsonwebtoken";

// ✅ 1. Define the shape of the Token
interface DecodedToken extends JwtPayload {
  userId: string;
  role: string;
}

async function getAdminUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token");
  if (!token) return null;
  
  try {
    // ✅ 2. Use 'as DecodedToken' instead of ': any'
    const decoded = jwt.verify(token.value, process.env.JWT_SECRET!) as DecodedToken;
    return decoded.role === "ADMIN" ? decoded : null;
  } catch (e) { return null; }
}

export async function PUT(req: Request) {
  try {
    await connectDB();

    // 1. Security Check
    const admin = await getAdminUser();
    if (!admin) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    // 2. Get Data
    // We can cast the body to a specific type to avoid 'any' here too
    const body = await req.json();
    const { userId, action } = body as { userId: string; action: string };

    // 3. Perform Action
    if (action === "APPROVE") {
      await User.findByIdAndUpdate(userId, { isVerified: true });
      return NextResponse.json({ message: "User Approved" });
    }

    return NextResponse.json({ message: "Invalid Action" }, { status: 400 });

  } catch (error) {
    return NextResponse.json({ message: "Error" }, { status: 500 });
  }
}