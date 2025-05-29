"use server"

import { generateSummarySchema } from "@/lib/formValidations";
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
- Be 3-5 sentences long.
- Highlight the candidate's genuine skills, experiences, and impact in a clear, confident voice.
- Naturally include relevant keywords to improve visibility in ATS filters without stuffing.
- Feel conversational and real, like something the candidate would proudly use on their resume.
- Mentions Users career goals and/or target roles (assume based on jobTitle if not provided)

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