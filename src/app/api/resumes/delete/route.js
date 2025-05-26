import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db/index";
import Resume from "@/models/Resume";

export async function DELETE(req) {
  try {
      const { resumeId } = await req.json();
    console.log("DELETE api hit!!!!!!!",resumeId )
    await connectToDatabase();



    if (!resumeId) {
      return NextResponse.json(
        { error: "Resume ID is required" },
        { status: 400 }
      );
    }

    const deletedResume = await Resume.findOneAndDelete({resumeId});

    if (!deletedResume) {
      return NextResponse.json(
        { error: "Resume not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Resume deleted successfully" },
      
    );

  } catch (error) {
    console.error("Error deleting resume:", error);
    return NextResponse.json(
      { error: "Failed to delete resume" },
      { status: 500 }
    );
  }
}
