import { NextResponse } from "next/server";
import connectDB from "@/lib/db";

export async function GET() {
  try {
    await connectDB();
    return NextResponse.json({ message: "Database connection successful!" });
  } catch (error) {
    return NextResponse.json(
      { message: "Database connection failed", error: (error as Error).message },
      { status: 500 }
    );
  }
}