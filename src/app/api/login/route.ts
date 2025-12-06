import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  try {
    await connectDB();
    const { email, password } = await req.json();

    // 1. Find User
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // 2. Check Password
    if (user.password !== password) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }

    // ✅ 3. SECURITY CHECK: Is the user Verified?
    // If user is a Resident and Admin hasn't approved them yet -> BLOCK THEM.
    if (!user.isVerified) {
      return NextResponse.json(
        { message: "Access Denied. Your account is pending Admin Approval." },
        { status: 403 } // 403 = Forbidden
      );
    }

    // 4. Generate Token
    const token = jwt.sign(
      { userId: user._id, role: user.role, name: user.name },
      process.env.JWT_SECRET!,
      { expiresIn: "1d" }
    );

    const response = NextResponse.json({ 
      message: "Login successful",
      role: user.role // Sending role so frontend knows where to redirect
    });
    
    response.cookies.set("token", token, {
      httpOnly: true,
      path: "/", 
    });

    return response;

  } catch (error) {
    return NextResponse.json(
      { message: "Login failed", error: (error as Error).message },
      { status: 500 }
    );
  }
}