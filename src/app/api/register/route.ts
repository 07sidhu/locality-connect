import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";

export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();
    const { name, email, password, role, societyId, flatNumber, adminKey } = body;

    // 1. Check if email exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: "Email already registered" },
        { status: 400 }
      );
    }

    // 2. ADMIN SECURITY CHECK
    let isVerified = false; // Default: Residents need approval
    
    if (role === "ADMIN") {
      // If trying to be Admin, MUST provide correct secret key
      if (adminKey !== process.env.ADMIN_SECRET_KEY) {
        return NextResponse.json(
          { message: "Invalid Admin Secret Key!" },
          { status: 403 } // Forbidden
        );
      }
      // If key is correct, Admin is auto-verified
      isVerified = true; 
    }

    // 3. Create User
    const newUser = await User.create({
      name,
      email,
      password,
      role: role || "RESIDENT",
      societyId,
      flatNumber: flatNumber || "Admin Office",
      isVerified, // Admins = True, Residents = False
    });

    return NextResponse.json(
      { message: "Registration successful!", user: newUser },
      { status: 201 }
    );

  } catch (error) {
    return NextResponse.json(
      { message: "Error registering", error: (error as Error).message },
      { status: 500 }
    );
  }
}