"use server";

import { resumeSchema, resumeScoreSchema } from "@/lib/formValidations";
import { generate } from "@/lib/gemini";
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
