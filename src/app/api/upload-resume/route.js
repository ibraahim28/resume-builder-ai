import { NextResponse } from "next/server";
import { getStructuredResume } from "@/app/(main)/resumes/_actions/getStructuredResume";
import { parsePdfText } from "@/lib/pdf";
import { readFile } from "fs/promises";
import { IncomingForm } from "formidable";
import { join } from "path";
import { mkdirSync, existsSync } from "fs";

export const config = {
  api: {
    bodyParser: false,
  },
};

const uploadDir = join(process.cwd(), "/tmp/uploads");

export async function POST(req) {
  try {
    console.log("UPLOAD DIRECTORY______________________________________________________________", uploadDir);
    if (!existsSync(uploadDir)) mkdirSync(uploadDir, { recursive: true });

    const formData = await new Promise((resolve, reject) => {
      const form = new IncomingForm({ uploadDir, keepExtensions: true });
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        else resolve({ fields, files });
      });
    });

    console.log("FORMDATA__________________________________", formData);

    const file = formData?.files?.resume;
    if (!file || file.mimetype !== "application/pdf") {
      return NextResponse.json(
        { error: "Invalid or missing PDF file." },
        { status: 400 }
      );
    }

    console.log("File________________________________", file);

    const buffer = await readFile(file.filepath);
    const rawText = await parsePdfText(buffer);

    if (!rawText || rawText.length < 50) {
      return NextResponse.json(
        { error: "Resume text too short or unreadable." },
        { status: 422 }
      );
    }

    console.log(
      "Rawtext______________________________________________________________________",
      rawText
    );

    const structuredResume = await getStructuredResume(rawText);

    console.log(
      "structuredResume______________________________________________________",
      structuredResume
    );
    return NextResponse.json(
      { success: true, resume: structuredResume },
      { status: 200 }
    );
  } catch (err) {
    console.error("Resume parsing error:", err);
    return NextResponse.json(
      { error: "Server error during resume parsing." },
      { status: 500 }
    );
  }
}
