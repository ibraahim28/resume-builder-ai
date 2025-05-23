"use server";

import {
  generateSummarySchema,
  generateWorkExperienceSchema,
  singleWorkExperienceSchema,
} from "@/lib/formValidations";
import { generate } from "@/lib/gemini";

export async function generateSummary(input) {
  //TODO: block for non premium users

  const {
    personalInfo,
    workExperiences,
    projects,
    educations,
    skills,
    hasWorkExperience,
  } = generateSummarySchema.parse(input);

  const systemMessage = `
   You are a professional resume writer. Generate concise and compelling resume summaries written in an implied first-person tone (without using "I", "me", or "my").

The summary should:
- Sound human and personalized, not robotic or buzzword-filled.
- Avoid corporate jargon and meaningless clichés like "results-driven" or "dynamic team player."
- Be 4-5 sentences long.
- Highlight the candidate's genuine skills, experiences, and impact in a clear, confident voice.
- Naturally include relevant keywords to improve visibility in ATS filters without stuffing.
- Feel conversational and real, like something the candidate would proudly use on their resume.

Avoid using headings or formatting, return only the summary paragraph.
`;

  const userMessage = `
Please generate a concise, professional resume summary based on the following user information:

Personal Information:
- Name: ${personalInfo.firstName || ""} ${personalInfo.lastName || ""}
- Job Title: ${personalInfo.jobTitle || "N/A"}
- Location: ${personalInfo.city && personalInfo.country ? `${personalInfo.city}, ${personalInfo.country}` : "N/A"}

Skills:
${skills.length > 0 ? skills.join(", ") : "No skills listed"}

${
  hasWorkExperience && workExperiences.length > 0
    ? `Work Experience:\n${workExperiences
        .map(
          (we) =>
            `Position : ${we.position || "N/A"} at ${we.company || "N/A"} from (${we.startDate || "N/A"} to ${we.endDate || "Present"}) 
            Description:
            ${we.description || ""}`
        )
        .join("\n")}`
    : ""
}

${
  !hasWorkExperience && projects.length > 0
    ? `Projects:\n${projects
        .map(
          (proj) =>
            `Project: ${proj.title || "N/A"} using tech stack: ${proj.techStack?.length > 0 ? proj.techStack.join(", ") : "N/A"}
             Project Description: ${proj.description || ""}
             `
        )
        .join("\n")}`
    : ""
}

${
  educations.length > 0
    ? `Education:\n${educations
        .map(
          (edu) =>
            `- ${edu.degree || "N/A"} at ${edu.school || "N/A"} from (${edu.startDate || "N/A"} to ${edu.endDate || "N/A"})`
        )
        .join("\n")}`
    : ""
}

Instructions:
- Make it 3-5 lines max.
- Highlight strengths and relevant experience.
`;

  console.log("prompt :", userMessage);

  const completion = await generate(systemMessage, userMessage);
  return completion;
}

export async function generateWorkExperience(input) {
  try {
    //TODO: block for non premium users

    if (!input || typeof input !== "object") {
      throw new Error("Invalid input provided");
    }

    const { description } = generateWorkExperienceSchema.parse(input);

    if (!description || description.trim().length === 0) {
      throw new Error("Description is required");
    }

    const systemMessage = `
You are a professional resume writer. Generate concise and compelling work experience entry based on the user input.
Your response must adhere to the following structure. You can omit fields if they can't be inferred from the provided input. 
But don't add any extra fields or information. 

{
  "position": "<string>",
  "company": "<string>",
  "startDate": "<YYYY-MM-DD (optional)>",
  "endDate": "<YYYY-MM-DD (optional)>",
  "description": ["<bullet 1>", "<bullet 2>", "<bullet 3>"]
}
Only respond with **valid JSON**. Do not include any commentary or extra text.
`;

    const userMessage = `
Please provide a work experience entry based on the following description:
${description}
`;

    console.log("prompt:", systemMessage + userMessage);

    const completion = await generate(systemMessage, userMessage);
    console.log("completion:", completion);

    let parsed;
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
      const validated = singleWorkExperienceSchema.parse(parsed);

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
    console.error("Generate Work Experience Error:", error);

    if (error.message.includes("parse")) {
      throw new Error("Failed to generate work experience. Please try again.");
    } else if (error.message.includes("required")) {
      throw new Error("Description is required to generate work experience.");
    } else {
      throw new Error("Failed to generate work experience. Please try again.");
    }
  }
}
