// /app/actions/getStructuredResume.js
"use server";

import { resumeSchema } from "@/lib/formValidations";
import { generate } from "@/lib/gemini";

export const getStructuredResume = async (rawText) => {
  const systemPrompt = `
You are a resume parser AI. Given the raw text of a resume, you must extract all relevant information and return a clean JSON object strictly matching the following schema:

{
  generalInfo: { title: "", description: "" },
  personalInfo: {
    photo: null,
    firstName: "",
    lastName: "",
    jobTitle: "",
    city: "",
    country: "",
    phone: "",
    email: ""
  },
  workExperience: {
    workExperiences: [
      {
        position: "",
        company: "",
        startDate: "",
        endDate: "",
        description: ""
      }
    ]
  },
  project: {
    projects: [
      {
        title: "",
        techStack: [],
        projectLink: "",
        description: ""
      }
    ]
  },
  education: {
    educations: [
      {
        degree: "",
        major: "",
        school: "",
        startDate: "",
        endDate: ""
      }
    ]
  },
  skills: {
    skills: []
  },
  summary: {
    summary: ""
  },
  appearance: {
    colorHex: "",
    borderStyle: ""
  },
  hasWorkExperience: true,
  createdAt: ISODateString,
  updatedAt: ISODateString
}

- Use null for unavailable fields.
- Only include projects, work experiences, or educations if present in the resume.
- Return valid JSON only — no markdown, no explanation.
`;

  const userPrompt = `Here is the raw resume text:\n\n"""${rawText}"""`;

  const result = await generate({
    systemPrompt,
    userPrompt,
    temperature: 0.3, 
    json: true,
  });

  try {
    const parsed = JSON.parse(result);
    const validated = resumeSchema.parse(parsed);

    const now = new Date().toISOString();

    return {
      ...validated,
      appearance: {
        colorHex: validated.appearance?.colorHex || "#000000",
        borderStyle: validated.appearance?.borderStyle || "square",
      },
    };
  } catch (error) {
    console.error("Failed to parse Gemini response:", error);
    throw new Error("Resume parsing failed. Please try again.");
  }
};
