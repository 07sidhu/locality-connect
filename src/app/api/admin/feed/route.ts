import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { Post } from "@/models/Post";
import { cookies } from "next/headers";
import jwt, { JwtPayload } from "jsonwebtoken";

interface DecodedToken extends JwtPayload { role: string; name: string; }

async function getAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token");
  if (!token) return null;
  try {
    const decoded = jwt.verify(token.value, process.env.JWT_SECRET!) as DecodedToken;
    return decoded.role === "ADMIN" ? decoded : null;
  } catch (e) { return null; }
}

export async function DELETE(req: Request) {
  try {
    await connectDB();
    const admin = await getAdmin();
    
    if (!admin) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { postId, reason } = await req.json();

    if (!reason) {
      return NextResponse.json({ message: "Reason is required" }, { status: 400 });
    }

    // 1. Find the post to get details before deleting (for logs)
    const post = await Post.findById(postId);
    if (!post) return NextResponse.json({ message: "Post not found" }, { status: 404 });

    // 2. LOG THE ACTION (In a real app, save to an 'AuditLog' collection)
    console.log(`[MODERATION] Admin ${admin.name} deleted post by ${post.authorName}. Reason: "${reason}"`);

    // 3. Delete the post
    await Post.findByIdAndDelete(postId);

    return NextResponse.json({ message: "Post Removed" });
  } catch (error) {
    return NextResponse.json({ message: "Error" }, { status: 500 });
  }
}