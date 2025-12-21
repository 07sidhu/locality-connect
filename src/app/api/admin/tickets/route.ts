import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { Ticket } from "@/models/Ticket";
import { cookies } from "next/headers";
import jwt, { JwtPayload } from "jsonwebtoken";

interface DecodedToken extends JwtPayload { role: string; }

// Helper to check Admin
async function isAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token");
  if (!token) return false;
  try {
    const decoded = jwt.verify(token.value, process.env.JWT_SECRET!) as DecodedToken;
    return decoded.role === "ADMIN";
  } catch (e) { return false; }
}

export async function PUT(req: Request) {
  try {
    await connectDB();
    if (!await isAdmin()) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { ticketId, action, staffName } = await req.json();

    if (action === "RESOLVE") {
      await Ticket.findByIdAndUpdate(ticketId, { status: "RESOLVED" });
      return NextResponse.json({ message: "Ticket Resolved" });
    }

    if (action === "ASSIGN") {
      await Ticket.findByIdAndUpdate(ticketId, { 
        status: "IN_PROGRESS",
        assignedTo: staffName 
      });
      return NextResponse.json({ message: `Assigned to ${staffName}` });
    }

    return NextResponse.json({ message: "Invalid Action" }, { status: 400 });

  } catch (error) {
    return NextResponse.json({ message: "Error" }, { status: 500 });
  }
}