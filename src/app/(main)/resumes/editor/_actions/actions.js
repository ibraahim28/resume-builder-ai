"use server";

import { resumeSchema } from "@/lib/formValidations";
import Resume from "@/models/Resume";
import { currentUser } from "@clerk/nextjs/server";
import { put } from "@vercel/blob";
import path from "path";

export async function saveResume(currentResumeId, values) {
  try {
    const user = await currentUser();
    if (!user) throw new Error("User not authenticated");
    const userId = user.id;

    console.log("Values ==========================", values);

    const parsed = resumeSchema.parse(values);

    const existingResume = currentResumeId
      ? await Resume.findOne({ resumeId: currentResumeId, userId })
      : null;

    let photoUrl = parsed.personalInfo.photo;

    if (photoUrl instanceof File) {
      if (existingResume?.personelInfo?.photo) {
        if (existingResume?.personalInfo?.photo !== photoUrl) {
          await del(existingResume.personalInfo.photo);
        }
      }

      const blob = await put(
        `resume_photos/${path.extname(photoUrl.name)}`,
        photoUrl,
        {
          access: "public",
        }
      );
      photoUrl = blob.url;
    } else if (photoUrl === null) {
      if (existingResume?.personalInfo?.photo) {
        await del(existingResume?.personalInfo?.photo);
      }
    }

    parsed.personalInfo.photo = photoUrl;
    const now = new Date().toISOString();
    const normalizedResume = {
      ...parsed,
      personalInfo: {
        ...parsed.personalInfo,
        photo: photoUrl,
      },
      workExperience: {
        workExperiences: parsed.workExperience.workExperiences.filter(
          (exp) => exp.position || exp.company
        ),
      },
      project: {
        projects: parsed.project.projects.filter(
          (proj) => proj.title || proj.description
        ),
      },
      education: {
        educations: parsed.education.educations.filter(
          (edu) => edu.degree || edu.school
        ),
      },
      updatedAt: now,
    };

    let resumeDoc;

    if (existingResume) {
      resumeDoc = await Resume.findByIdAndUpdate(
        existingResume._id,
        { data: normalizedResume, updatedAt: now },
        { new: true }
      ).lean();
    } else {
      resumeDoc = await Resume.create({
        userId,
        resumeId: currentResumeId,
        data: normalizedResume,
      });
      resumeDoc = resumeDoc.toObject();
    }

    return {
      success: true,
      resumeId: resumeDoc._id.toString(),
      resumeData: resumeDoc.data,
    };
  } catch (error) {
    console.error("Resume save error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
