import connectToDatabase from "@/lib/db";
import Resume from "@/models/Resume";
import { auth } from "@clerk/nextjs/dist/types/server";

export async function DELETE(req) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { resumeId } = await req.json();
    if (!resumeId) {
      return new Response(
        JSON.stringify({ success: false, message: "Resume ID is required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
    await connectToDatabase();
    const result = await Resume.findOneAndDelete({ resumeId });
    if (!result) {
      return new Response(
        JSON.stringify({ success: false, message: "Resume not found" }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    return new Response(
      JSON.stringify({ success: true, message: "Resume deleted successfully" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error deleting resume:", error);
    return new Response(
      JSON.stringify({ success: false, message: "Internal Server Error" })
    );
  }
}
