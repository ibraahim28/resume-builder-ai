import { z } from "zod";

export const optionalString = z.string().trim().optional().or(z.literal(""));

export const generalInfoSchema = z.object({
  title: optionalString,
  description: optionalString,
});

export const personalInfoSchema = z.object({
  photo: z
    .custom()
    .refine(
      (file) => file === null || file instanceof File || typeof file === 'string',
      "Photo must be a valid file or base64 string"
    )
    .refine(
      (file) =>
        file === null ||
        (file instanceof File
          ? ["image/jpeg", "image/png", "image/gif", "image/webp"].includes(file.type)
          : file.startsWith('data:image/')),
      "Photo must be a JPEG, PNG, GIF, or WEBP image"
    )
    .refine(
      (file) => file === null || (file instanceof File ? file.size <= 4 * 1024 * 1024 : true),
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
        school: optionalString,
        startDate: optionalString,
        endDate: optionalString,
      })
    )
    .optional(),
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
    .optional(),
});

export const projectsSchema = z.object({
  projects: z
    .array(
      z.object({
        title: optionalString,
        projectLink: optionalString,
        description: optionalString,
      })
    )
    .optional(),
});

export const skillsSchema = z.object({
  skills: z.array(z.string().trim()).optional(),
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
});
