export const runtime = "nodejs";

import { NextResponse } from "next/server";
import formidable from "formidable";
import { Readable } from "stream";
import { parsePdfText } from "@/lib/pdf";
import { getStructuredResume } from "@/app/(main)/resumes/_actions/getStructuredResume";
import fs from "fs";
import path from "path";

export const config = {
  api: {
    bodyParser: false,
  },
};

async function streamToNodeRequest(request) {
  const readable = Readable.from(request.body);

  readable.headers = {
    "content-type": request.headers.get("content-type") || "",
    "content-length": request.headers.get("content-length") || "0",
  };
  readable.method = request.method;

  return readable;
}

function parseForm(req) {
  const uploadDir = "/tmp/uploads"; // ✅ Vercel-compatible temp folder


  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  return new Promise((resolve, reject) => {
    const form = formidable({
      uploadDir,
      keepExtensions: true,
      multiples: false,
    });

    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      else resolve({ fields, files });
    });
  });
}

export async function POST(request) {
  let filePathToDelete = null;

  try {
    const nodeReq = await streamToNodeRequest(request);
    const { files } = await parseForm(nodeReq);

    const uploaded = files.resume;
    const file = Array.isArray(uploaded) ? uploaded[0] : uploaded;

    if (!file || !file.filepath) {
      return NextResponse.json(
        { success: false, error: "File path is missing." },
        { status: 400 }
      );
    }

    if (file.mimetype !== "application/pdf") {
      return NextResponse.json(
        { success: false, error: "Uploaded file is not a pdf." },
        { status: 400 }
      );
    }

    filePathToDelete = file.filepath;

    const buffer = fs.readFileSync(filePathToDelete);
    const rawText = await parsePdfText(buffer);
    const structuredResume = await getStructuredResume(rawText);

    return NextResponse.json({ success: true, resume: structuredResume });
  } catch (error) {
    console.error("Resume upload/parsing error:", error);
    return NextResponse.json({ success: false, error: error.message });
  } finally {
    
    if (filePathToDelete && fs.existsSync(filePathToDelete)) {
      try {
        fs.unlinkSync(filePathToDelete);
        console.log("Deleted uploaded file:", filePathToDelete);
      } catch (unlinkError) {
        console.warn("Failed to delete uploaded file:", unlinkError);
      }
    }
  }
}