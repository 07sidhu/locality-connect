import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { Service } from "@/models/Service"; // Check this import path!
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

async function getUserFromToken() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token");
  if (!token) return null;
  try {
    return jwt.verify(token.value, process.env.JWT_SECRET!);
  } catch (e) {
    return null;
  }
}

// 1. GET: List all helpers
export async function GET() {
  try {
    await connectDB();
    
    const user: any = await getUserFromToken();
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Fetch services
    const services = await Service.find().sort({ createdAt: -1 });

    return NextResponse.json({ services });
  } catch (error) {
    console.error("GET Services Error:", error); // <--- This will show us the real error
    return NextResponse.json(
      { message: "Error fetching services", error: (error as Error).message },
      { status: 500 }
    );
  }
}

// 2. POST: Add a new helper
export async function POST(req: Request) {
  try {
    await connectDB();
    
    const user: any = await getUserFromToken();
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { name, role, phoneNumber, societyId } = await req.json();

    const newService = await Service.create({
      name,
      role,
      phoneNumber,
      societyId,
    });

    return NextResponse.json({ message: "Helper added", service: newService }, { status: 201 });
  } catch (error) {
    console.error("POST Services Error:", error);
    return NextResponse.json(
      { message: "Error adding service", error: (error as Error).message }, 
      { status: 500 }
    );
  }
}