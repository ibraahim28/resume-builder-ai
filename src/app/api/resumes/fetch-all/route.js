import { getAuth } from "@clerk/nextjs/server";
import Resume from "@/models/Resume";
import connectToDatabase from "@/lib/db";

export async function GET(req) {
  try {
    const { userId } = getAuth(req);

    if (!userId) {
      return new Response(JSON.stringify({ message: "Unauthorized" }), {
        status: 401,
      });
    }

    await connectToDatabase();

    const resumes = await Resume.find({ userId }).lean();

    return new Response(JSON.stringify({ success: true, resumes }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching resumes:", error);
    return new Response(
      JSON.stringify({ success: false, message: "Internal Server Error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
