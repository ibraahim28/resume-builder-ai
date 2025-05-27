"use server";

import { generateProjectEntrySchema, singleProjectSchema } from "@/lib/formValidations";
import { generate } from "@/lib/gemini";

export async function generateProjectEntry(input) {
  try {
    //TODO: block for non premium users

    if (!input || typeof input !== "object") {
      throw new Error("Invalid input provided");
    }

    const { description } = generateProjectEntrySchema.parse(input);

    if (!description || description.trim().length === 0) {
      throw new Error("Description is required");
    }

    const systemMessage = `
You are a professional resume writer. Generate concise, professional and convincing project entry for the user's resume based on the user input.
Your response must adhere to the following structure. You can omit fields if they can't be inferred from the provided input. 
But don't add any extra fields or information. 

{
  "title": "<string>",
  "techStack": ["<tech 1>", "<tech 2>", "<tech 3> ..."]
  "description": ["<bullet 1>", "<bullet 2>", "<bullet 3>"],
}
Only respond with **valid JSON**. Do not include any commentary or extra text.
 Description should have 2-3 bullet points, not any less, not anymore.
`;

    const userMessage = `
Please provide a project entry based on the following description:
${description}
`;

    console.log("prompt:", systemMessage + userMessage);

    const completion = await generate(systemMessage, userMessage);
    console.log("completion:", completion);

    try {
      const cleanedCompletion = completion
        .replace(/```json\n?|\n?```/g, "")
        .trim();
      const firstBraceIndex = cleanedCompletion.indexOf("{");
      const lastBraceIndex = cleanedCompletion.lastIndexOf("}");

      if (firstBraceIndex === -1 || lastBraceIndex === -1) {
        throw new Error("Invalid JSON format returned by AI.");
      }

      const jsonSlice = cleanedCompletion.slice(
        firstBraceIndex,
        lastBraceIndex + 1
      );
      const parsed = JSON.parse(jsonSlice);

      if (Array.isArray(parsed.description)) {
        parsed.description = parsed.description
          .map((line) => `• ${line}`)
          .join("\n");
      }

      console.log("Parsed JSON:", parsed);
      const validated = singleProjectSchema.parse(parsed);

      if (!validated) {
        throw new Error("Parsed JSON does not match the expected Schema.");
      }

      return parsed;
    } catch (parseError) {
      console.error("JSON Parse Error:", parseError);
      console.error("Raw completion:", completion);
      throw new Error("Failed to parse AI response. Please try again.");
    }
  } catch (error) {
    console.error("Generate Project Error:", error);

    if (error.message.includes("parse")) {
      throw new Error("Failed to generate Project. Please try again.");
    } else if (error.message.includes("required")) {
      throw new Error("Description is required to generate Project.");
    } else {
      throw new Error("Failed to generate Project. Please try again.");
    }
  }
}