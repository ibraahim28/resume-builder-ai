"use server";

import {
  generateSummarySchema,
  generateWorkExperienceSchema,
  resumeSchema,
  resumeScoreSchema,
  singleProjectSchema,
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
You are a professional resume writer. Generate concise, professional and convincing work experience entry based on the user input.
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
 Description should have 2-3 bullet points, not any less, not anymore
`;

    const userMessage = `
Please provide a work experience entry based on the following description:
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

export async function generateProjectEntry(input) {
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

import ResumeAnalysis from "@/models/ResumeAnalysis";
import { currentUser } from "@clerk/nextjs/server";

export async function analyzeResume(input, currentResumeId) {
  try {
    if (!input || typeof input !== "object") {
      throw new Error("Invalid input provided");
    }

    const user = await currentUser();
    if (!user) throw new Error("User not authenticated");
    const userId = user.id;

    const previousAnalysis = await ResumeAnalysis.findOne({
      userId,
      resumeId: currentResumeId,
    })
      .sort({ createdAt: -1 })
      .lean();

    if (
      previousAnalysis &&
      JSON.stringify(previousAnalysis.resumeSnapshot) === JSON.stringify(input)
    ) {
      return {
        score: previousAnalysis.score,
        breakdown: previousAnalysis.breakdown,
        tips: previousAnalysis.tips,
      };
    }

    const {
      personalInfo,
      workExperience,
      project,
      education,
      skills,
      summary,
      hasWorkExperience,
    } = resumeSchema.parse(input);
    const systemMessage = `You are a senior HR professional, resume optimization specialist, and ATS (Applicant Tracking System) consultant. Your role is to critically analyze the provided resume **based on the actual content**, structure, and presentation — not with generic or assumed suggestions.\n\nPlease return a detailed evaluation in the following strict JSON format:\n\n{\n  "score": number, // 0-100. Based on ATS optimization, hiring potential, and content clarity.\n  "breakdown": {\n    "hirability": number, // 0-10. How appealing the resume is for recruiters.\n    "professionalism": number // 0-10. Grammar, tone, formatting, clarity, structure.\n  },\n  "tips": string[] // Concise, actionable, relevant suggestions ONLY based on detected flaws.\n}\n\n**Important Guidelines for Evaluation:**\n\n1. The structure of the resume will be this>>>>>\n {
generalInfo: { title: "", description: "" },
personalInfo: {
photo: "" || null,
firstName: "",
lastName: "",
jobTitle: "",
city: "",
country: "",
phone: "",
email: "",
},
workExperience: {
workExperiences: [
{
position: "",
company: "",
startDate: "",
endDate: "",
description: "",
},
],
},
project: {
projects: [
{
title: "",
techStack : [],
projectLink: "",
description: "",
},
],
},
education: {
educations: [
{
degree: "",
major : "",
school: "",
startDate: "",
endDate: "",
},
],
},
skills: {
skills: [],
},
summary: {
summary: "",
},
appearance: {
colorHex: "",
borderStyle: "",
},
hasWorkExperience: true,
createdAt: new Date().toISOString(),
updatedAt: new Date().toISOString(),
} \n4. Suggestions must be professional, **resume-specific**, and directly reflect the actual data structure and content quality, **DONOT SUGGEST ANYTHING THAT GOES AGAINST OR ISNT IN THE STRUCTURE OF THE RESUME**. Like adding a certain field somewhere or explanation about the educcation or anything outside the schema of the resume you have been provided with.\n5. Keep suggestions in **short sentences**, focusing on clarity, readability, and real improvement.\n6. Provide a fair, balanced score based on resume strength, writing quality, section usage, clarity, and job-readiness.\n7. Do not suggest adding or modifying sections outside the existing structure. Focus on improving content within the defined fields only.\n\nOnly output valid JSON. Do not include explanations or extra text.\n\n    `;

    const userMessage = `
    Analyze the following resume data:
    
    Personal Information:
    - Name: ${personalInfo.firstName || ""} ${personalInfo.lastName || ""}
    - JobTitle: ${personalInfo.jobTitle || "N/A"}
    - Location: ${personalInfo.city || ""}, ${personalInfo.country || ""}
    - Phone: ${personalInfo.phone || "N/A"}
    - Email: ${personalInfo.email || "N/A"}

    Summary: 
    ${summary.summary || ""}

   ${
     hasWorkExperience
       ? `
    Work Experience:
    ${
      workExperience.workExperiences
        ?.map(
          (we) => `
      - ${we.position} at ${we.company} (${we.startDate} to ${we.endDate})
      ${we.description}`
        )
        .join("\n") || "None"
    }
    `
       : `
    Projects:
    ${
      project.projects
        ?.map(
          (proj) => `
      - ${proj.title}: ${proj.description} techStack: [${proj.techStack?.join(", ")}]`
        )
        .join("\n") || "None"
    }
    `
   }
    
    Education:
    ${
      education.educations
        ?.map(
          (edu) => `
      - ${edu.degree} at ${edu.school} (${edu.startDate} to ${edu.endDate})`
        )
        .join("\n") || "None"
    }
    
    Skills:
    ${skills.skills?.join(", ") || "None listed"}
    
    `;

    console.log("Prompt: ", systemMessage, userMessage);

    const completion = await generate(systemMessage, userMessage);

    const cleaned = completion
      .replace(/```json/g, "")
      .replace(/\*\*/g, "")
      .replace(/```/g, "")
      .trim();
    const parsed = JSON.parse(cleaned);
    const validated = resumeScoreSchema.parse(parsed);

    // Compare current resume with previous snapshot if exists
    if (previousAnalysis) {
      const prevSnapshot = previousAnalysis.resumeSnapshot;
      const prevTips = new Set(previousAnalysis.tips);
      let implementedSuggestions = [];
      let scoreAdjustment = 0;

      // Check if previous suggestions were implemented
      validated.tips.forEach((tip) => {
        if (!prevTips.has(tip)) {
          implementedSuggestions.push(tip);
          scoreAdjustment += 2; // Increase score for each implemented suggestion
        }
      });

      // Adjust final score based on improvements
      const finalScore = Math.min(
        100,
        Math.max(0, validated.score + scoreAdjustment)
      );
      validated.score = finalScore;
    }

    // Save the analysis
    await ResumeAnalysis.create({
      userId,
      resumeId: input.resumeId,
      score: validated.score,
      breakdown: validated.breakdown,
      tips: validated.tips,
      previousScore: previousAnalysis?.score,
      implementedSuggestions: previousAnalysis?.implementedSuggestions || [],
      resumeSnapshot: input,
    });

    // Ensure only plain objects are returned
    return JSON.parse(JSON.stringify(validated));
  } catch (error) {
    console.error("Resume analysis error:", error);
    throw new Error("Failed to analyze resume. Please try again.");
  }
}
