import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { Ticket } from "@/models/Ticket";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

// ✅ FIX: This function is now Async
async function getUserFromToken() {
  const cookieStore = await cookies(); // <--- Added await here
  const token = cookieStore.get("token");

  if (!token) return null;

  try {
    const decoded: any = jwt.verify(token.value, process.env.JWT_SECRET!);
    return decoded;
  } catch (e) {
    return null;
  }
}

export async function GET() {
  await connectDB();
  
  // ✅ FIX: Added await here
  const user = await getUserFromToken(); 
  
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const tickets = await Ticket.find({ userId: user.userId }).sort({ createdAt: -1 });

  return NextResponse.json({ tickets });
}

export async function POST(req: Request) {
  try {
    await connectDB();
    
    // ✅ FIX: Added await here
    const user = await getUserFromToken(); 

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { title, description, category, societyId, imageUrl } = await req.json();

    const newTicket = await Ticket.create({
      title,
      description,
      category,
      imageUrl,
      userId: user.userId,
      societyId,
    });

    return NextResponse.json({ message: "Ticket created", ticket: newTicket }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error creating ticket", error: (error as Error).message },
      { status: 500 }
    );
  }
}