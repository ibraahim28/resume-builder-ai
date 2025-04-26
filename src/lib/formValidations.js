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
  schoolName: z.string().trim().optional().or(z.literal("")),
  degree: z.string().trim().optional().or(z.literal("")),
  startDate: z.string().trim().optional().or(z.literal("")),
  endDate: z.string().trim().optional().or(z.literal("")),
});

export const workExperienceSchema = z.object({
  companyName: z.string().trim().optional().or(z.literal("")),
  jobTitle: z.string().trim().optional().or(z.literal("")),
  startDate: z.string().trim().optional().or(z.literal("")),
  endDate: z.string().trim().optional().or(z.literal("")),
  location: z.string().trim().optional().or(z.literal("")),
  currentlyWorking: z.boolean().default(false),
  description: z.string().trim().optional().or(z.literal("")),
});

export const skillsSchema = z.object({
  skillsList: z.array(z.string()),
});

export const projectSchema = z.object({
  projectName: z.string().trim().optional().or(z.literal("")),
  role: z.string().trim().optional().or(z.literal("")),
  startDate: z.string().trim().optional().or(z.literal("")),
  endDate: z.string().trim().optional().or(z.literal("")),
  projectUrl: z.string().trim().url().optional().or(z.literal("")),
  description: z.string().trim().optional().or(z.literal("")),
  technologies: z.string().trim().optional().or(z.literal("")),
});

export const summarySchema = 123;
