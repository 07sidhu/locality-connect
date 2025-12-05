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

    // 2. Check Password (Direct string comparison for now)
    // Note: In real production, we use bcrypt.compare() here.
    if (user.password !== password) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }

    // 3. Generate Token (The Digital ID Card)
    const token = jwt.sign(
      { userId: user._id, role: user.role, name: user.name },
      process.env.JWT_SECRET!,
      { expiresIn: "1d" } // Token expires in 1 day
    );

    // 4. Return the Token
    const response = NextResponse.json({ message: "Login successful" });
    
    // Set the token in a generic cookie (simplest way for Next.js)
    response.cookies.set("token", token, {
      httpOnly: true, // Frontend JS cannot steal it
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