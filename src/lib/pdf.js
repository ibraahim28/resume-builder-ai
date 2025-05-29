import pdfParse from "pdf-parse";

export async function parsePdfText(buffer) {
  const data = await pdfParse(buffer);
  return data.text;
}