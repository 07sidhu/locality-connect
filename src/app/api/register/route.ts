import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";

// ✅ CORRECT: Named export "POST", no "default" keyword
export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();
    const { name, email, password, role, societyId, flatNumber } = body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: "Email already registered" },
        { status: 400 }
      );
    }

    const newUser = await User.create({
      name,
      email,
      password,
      role: role || "RESIDENT",
      societyId,
      flatNumber,
    });

    return NextResponse.json(
      { message: "User registered successfully!", user: newUser },
      { status: 201 }
    );

  } catch (error) {
    console.error("Register Error:", error);
    return NextResponse.json(
      { message: "Error registering user", error: (error as Error).message },
      { status: 500 }
    );
  }
}