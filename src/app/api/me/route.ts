import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt, { JwtPayload } from "jsonwebtoken";
import connectDB from "@/lib/db";
import User from "@/models/User";

interface DecodedToken extends JwtPayload {
  userId: string;
}

export async function GET() {
  await connectDB();
  const cookieStore = await cookies();
  const token = cookieStore.get("token");

  if (!token) {
    return NextResponse.json({ user: null });
  }

  try {
    const decoded = jwt.verify(token.value, process.env.JWT_SECRET!) as DecodedToken;
    
    // Fetch fresh details from DB (excluding password)
    const user = await User.findById(decoded.userId).select("-password");
    
    if (!user) return NextResponse.json({ user: null });

    return NextResponse.json({ user });
  } catch (e) {
    return NextResponse.json({ user: null });
  }
}