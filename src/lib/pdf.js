import pdfParse from "pdf-parse";

export async function parsePdfText(buffer) {
  try {
    const data = await pdfParse(buffer);
    return data.text;
  } catch (error) {
    console.error("Error parsing PDF:", error);
    throw new Error("Failed to parse PDF text");
  }
}
