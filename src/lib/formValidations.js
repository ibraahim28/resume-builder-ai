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
      (file) => !file || file instanceof File,
      "Photo must be a valid file"
    )
    .refine(
      (file) =>
        !file ||
        ["image/jpeg", "image/png", "image/gif", "image/webp"].includes(
          file.type
        ),
      "Photo must be a JPEG, PNG, GIF, or WEBP image"
    )
    .refine(
      (file) => !file || file.size <= 4 * 1024 * 1024,
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
  wrokExperiences: z
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

export const skillsSchema = z.object({
  skills: z.array(z.string().trim()).optional(),
});

export const summarySchema = z.object({
  summary: optionalString,
});

export const resumeSchema = z.object({
  ...generalInfoSchema.shape,
  ...personalInfoSchema.shape,
  ...workExperienceSchema.shape,
  ...educationSchema.shape,
  ...skillsSchema.shape,
  colorHex : optionalString,
  borderStyle : optionalString,
});
