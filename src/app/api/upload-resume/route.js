export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { parsePdfText } from "@/lib/pdf";
import { getStructuredResume } from "@/app/(main)/resumes/_actions/getStructuredResume";

export async function GET() {
  return NextResponse.json({ success: true, message: "Use POST to upload resume." });
}

export async function POST(request) {
  try {
    
    const formData = await request.formData();
    const file = formData.get('resume');
    
    if (!file) {
      return NextResponse.json(
        { success: false, error: "No file uploaded." },
        { status: 400 }
      );
    }

    if (file.type !== "application/pdf") {
      return NextResponse.json(
        { success: false, error: "Uploaded file is not a PDF." },
        { status: 400 }
      );
    }

    
    const buffer = Buffer.from(await file.arrayBuffer());
    
    
    const rawText = await parsePdfText(buffer);
    
    
    const structuredResume = await getStructuredResume(rawText);

    return NextResponse.json({ success: true, resume: structuredResume });
  } catch (error) {
    console.error("Resume upload/parsing error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "An error occurred while processing the resume." },
      { status: 500 }
    );
  }
}