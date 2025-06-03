"use server";

import { resumeSchema } from "@/lib/formValidations";
import { generate } from "@/lib/gemini";

function replaceNullsWithEmptyStrings(obj) {
  if (obj === null) return "";
  if (Array.isArray(obj)) return obj.map(replaceNullsWithEmptyStrings);
  if (typeof obj === "object") {
    const newObj = {};
    for (const key in obj) {
      newObj[key] = replaceNullsWithEmptyStrings(obj[key]);
    }
    return newObj;
  }
  return obj;
}

export const getStructuredResume = async (rawText) => {
  try {
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
    colorHex: "#000000",
    borderStyle: "square"
  },
  hasWorkExperience: true
}

- Use null for unavailable fields.
- Only include projects, work experiences, or educations if present in the resume.
- Return valid JSON only — no markdown, no explanation.
- For appearance, use #000000 for colorHex and "square" for borderStyle if not specified.
- Extract as much information as possible from the resume text.
`;

    const userPrompt = `Here is the raw resume text:\n\n"""${rawText}"""`;

    const result = await generate(systemPrompt, userPrompt);

    const cleaned = result
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const parsed = JSON.parse(cleaned);
    const cleanedParsed = replaceNullsWithEmptyStrings(parsed);
    if (typeof cleanedParsed.personalInfo?.photo === "string") {

      const photo = cleanedParsed.personalInfo.photo;
      if (
        !photo.startsWith("data:image/jpeg") &&
        !photo.startsWith("data:image/png") &&
        !photo.startsWith("data:image/gif") &&
        !photo.startsWith("data:image/webp")
      ) {
        cleanedParsed.personalInfo.photo = null;
      }
    }
    const validated = resumeSchema.parse(cleanedParsed);

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
