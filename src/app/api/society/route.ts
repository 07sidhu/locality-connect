import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Society from "@/models/Society";

// POST Method: To Create a New Society
export async function POST(req: Request) {
  try {
    // 1. Connect to DB
    await connectDB();

    // 2. Read the data sent from the user (Frontend)
    const body = await req.json();
    const { name, address } = body;

    // 3. Validation: Make sure data is not empty
    if (!name || !address) {
      return NextResponse.json(
        { message: "Name and Address are required" },
        { status: 400 }
      );
    }

    // 4. Create the new Society in Database
    const newSociety = await Society.create({
      name,
      address,
    });

    // 5. Return success message
    return NextResponse.json(
      { message: "Society Created!", society: newSociety },
      { status: 201 }
    );

  } catch (error) {
    console.error("DETAILED ERROR:", error);
    return NextResponse.json(
      { message: "Error creating society", error: (error as Error).message },
      { status: 500 }
    );
  }
}