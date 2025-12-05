import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { Post } from "@/models/Post"; // Named Import
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

// 1. GET: Fetch the Feed
export async function GET() {
  try {
    await connectDB();
    const user = await getUserFromToken();
    if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const posts = await Post.find().sort({ createdAt: -1 }); // Newest first

    return NextResponse.json({ posts });
  } catch (error) {
    return NextResponse.json({ message: "Error" }, { status: 500 });
  }
}

// 2. POST: Create a new message
export async function POST(req: Request) {
  try {
    await connectDB();
    const user: any = await getUserFromToken(); // Need "any" to access user.name
    if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { content, type, societyId } = await req.json();

    const newPost = await Post.create({
      content,
      type: type || "GENERAL",
      authorName: user.name, // Saved from token
      authorId: user.userId,
      societyId,
    });

    return NextResponse.json({ message: "Posted!", post: newPost }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Error" }, { status: 500 });
  }
}