import { z } from "zod";

export const optionalString = z.string().trim().optional().or(z.literal(""));

export const generalInfoSchema = z.object({
  title: optionalString,
  description: optionalString,
});

export const personalInfoSchema = z.object({
  photo: z
    .custom()
    .nullable()
    .refine(
      (file) =>
        file === null ||
        (file instanceof File
          ? ["image/jpeg", "image/png", "image/gif", "image/webp"].includes(
              file.type
            )
          : typeof file === "string" && file.startsWith("data:image/")),
      "Photo must be a JPEG, PNG, GIF, or WEBP image"
    )
    .refine(
      (file) =>
        file === null ||
        (file instanceof File ? file.size <= 4 * 1024 * 1024 : true),
      "Photo must be less than 4MB"
    )
    .optional(),
  firstName: optionalString,
  lastName: optionalString,
  jobTitle: optionalString,
  city: optionalString,
  country: optionalString,
  phone: optionalString,
  email: optionalString,
});

export const educationSchema = z.object({
  educations: z
    .array(
      z.object({
        degree: optionalString,
        major: optionalString,
        school: optionalString,
        startDate: optionalString,
        endDate: optionalString,
      })
    )
    .default([]),
});

export const workExperienceSchema = z.object({
  workExperiences: z
    .array(
      z.object({
        position: optionalString,
        company: optionalString,
        startDate: optionalString,
        endDate: optionalString,
        description: optionalString,
      })
    )
    .default([]),
});

export const projectsSchema = z.object({
  projects: z
    .array(
      z.object({
        title: optionalString,
        techStack: z.array(z.string().trim()).optional(),
        projectLink: optionalString,
        description: optionalString,
      })
    )
    .default([]),
});

export const skillsSchema = z.object({
  skills: z.array(z.string().trim()).default([]),
});

export const summarySchema = z.object({
  summary: optionalString,
});

export const appearanceSchema = z.object({
  colorHex: optionalString,
  borderStyle: optionalString,
});

export const resumeSchema = z.object({
  generalInfo: generalInfoSchema,
  personalInfo: personalInfoSchema,
  education: educationSchema,
  workExperience: workExperienceSchema,
  project: projectsSchema,
  skills: skillsSchema,
  summary: summarySchema,
  appearance: appearanceSchema,
  hasWorkExperience: z.boolean().optional(),
});

export const singleWorkExperienceSchema = z.object({
  position: optionalString,
  company: optionalString,
  startDate: optionalString,
  endDate: optionalString,
  description: optionalString,
});

export const singleProjectSchema = z.object({
  title: optionalString,
  techStack: z.array(z.string().trim()).optional(),
  projectLink: optionalString,
  description: optionalString,
});

export const generateWorkExperienceSchema = z.object({
  description: z
    .string()
    .trim()
    .min(1, "Description is required to generate entry")
    .min(20, "Description should be at least 20 characters long"),
});

export const generateProjectEntrySchema = z.object({
  description: z
    .string()
    .trim()
    .min(1, "Description is required to generate entry")
    .min(20, "Description should be at least 20 characters long"),
});

export const generateSummarySchema = z.object({
  personalInfo: z.object({
    firstName: optionalString,
    lastName: optionalString,
    jobTitle: optionalString,
    city: optionalString,
    country: optionalString,
  }),
  workExperiences: workExperienceSchema.shape.workExperiences,
  projects: projectsSchema.shape.projects,
  educations: educationSchema.shape.educations,
  skills: skillsSchema.shape.skills,
  hasWorkExperience: resumeSchema.shape.hasWorkExperience,
});

export const resumeScoreSchema = z.object({
  score: z.number().min(0).max(100),
  breakdown: z.object({
    hirability: z.number().min(0).max(10),
    professionalism: z.number().min(0).max(10),
  }),
  tips: z.array(z.string()),
});

export const partialResumeSchema = resumeSchema.partial();
