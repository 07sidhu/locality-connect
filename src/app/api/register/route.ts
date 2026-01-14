import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs"; // <--- 1. Import

export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();
    const { name, email, password, role, societyId, flatNumber, adminKey } = body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: "Email already registered" }, { status: 400 });
    }

    // Admin Check Logic
    let isVerified = false;
    if (role === "ADMIN") {
      if (adminKey !== process.env.ADMIN_SECRET_KEY) {
        return NextResponse.json({ message: "Invalid Admin Secret Key!" }, { status: 403 });
      }
      isVerified = true; 
    }

    // ✅ 2. HASH THE PASSWORD
    const hashedPassword = await bcrypt.hash(password, 10); // 10 is the "salt rounds"

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword, // <--- Save the Hash, not the text
      role: role || "RESIDENT",
      societyId,
      flatNumber: flatNumber || "Admin Office",
      isVerified,
    });

    return NextResponse.json({ message: "Registration successful!", user: newUser }, { status: 201 });

  } catch (error) {
    return NextResponse.json({ message: "Error registering" }, { status: 500 });
  }
}