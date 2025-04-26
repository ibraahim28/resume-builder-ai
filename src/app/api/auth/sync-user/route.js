import { NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import connectToDB from "@/lib/db/index";
import User from "@/models/User";

export async function POST(req) {
  try {
    const { userId } = getAuth(req);

    if (!userId) {
      console.log("❌ No userId ");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Using req.body directly (no need for req.json())
    const { email, firstName, lastName, profileImage } = await req.json(); // Ensure to wait for the body to be parsed


    await connectToDB();

    const user = await User.findOneAndUpdate(
      { clerkId: userId },
      {
        $set: {
          email,
          firstName,
          lastName,
          profileImage,
          updatedAt: new Date(),
        },
        $setOnInsert: {
          createdAt: new Date(),
        },
      },
      { upsert: true, new: true }
    );


    return NextResponse.json({ user });
  } catch (error) {
    console.error("❌ Sync error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
