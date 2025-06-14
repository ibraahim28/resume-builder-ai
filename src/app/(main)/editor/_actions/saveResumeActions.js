"use server";

import { resumeSchema } from "@/lib/formValidations";
import Resume from "@/models/Resume";
import { currentUser } from "@clerk/nextjs/server";
import { uploadToCloudinary, deleteFromCloudinary } from "@/lib/cloudinary";
import connectToDatabase from "@/lib/db";

export async function saveResume(currentResumeId, values) {
  let existingResume = null;
  let parsed = null;
  let normalizedResume = null;
  let resumeDoc = null;
  let photoUrl = null;
  let user = null;

  try {
    user = await currentUser();
    if (!user) throw new Error("User not authenticated");
    const userId = user.id;

    await connectToDatabase();

    parsed = resumeSchema.parse(values);

    existingResume = currentResumeId
      ? await Resume.findOne({ resumeId: currentResumeId, userId })
      : null;

    photoUrl = parsed.personalInfo.photo;
    let cloudinaryResult = null;

    // Handle photo upload/removal
    if (photoUrl && photoUrl.startsWith("data:")) {
      if (existingResume?.personalInfo?.photo) {
        await deleteFromCloudinary(existingResume.personalInfo.photo);
      }

      cloudinaryResult = await uploadToCloudinary(photoUrl, {
        public_id: `resume_${userId}_${currentResumeId}_${Date.now()}`,
        transformation: [{ width: 500, height: 500, crop: "limit" }],
      });

      photoUrl = cloudinaryResult.secure_url;
    } else if (photoUrl === null) {
      if (existingResume?.personalInfo?.photo) {
        await withRetry(
          () => deleteFromCloudinary(existingResume.personalInfo.photo),
          "cloudinary-cleanup"
        );
      }
    }

    parsed.personalInfo.photo = photoUrl;

    const now = new Date().toISOString();
    normalizedResume = {
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
    // Retry wrapper for critical operations
    const MAX_RETRIES = 3;
    const RETRY_DELAY = 1000;
    async function withRetry(fn, context = "") {
      for (let i = 0; i < MAX_RETRIES; i++) {
        try {
          return await fn();
        } catch (error) {
          console.error(`Attempt ${i + 1} failed for ${context}:`, error);
          if (i === MAX_RETRIES - 1) throw error;
          await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
        }
      }
    }

    // Fallback safety
    if (!user) {
      return {
        success: false,
        error: "Not authenticated",
        errorCode: "AUTH_FAILURE",
      };
    }

    // Safe cloudinary delete
    if (existingResume?.personalInfo?.photo) {
      await withRetry(
        () => deleteFromCloudinary(existingResume.personalInfo.photo),
        "cloudinary-delete"
      );
    }

    // Fallback update attempt
    if (existingResume?._id && normalizedResume) {
      await withRetry(
        () =>
          Resume.findByIdAndUpdate(
            existingResume._id,
            { data: normalizedResume, updatedAt: new Date().toISOString() },
            { new: true }
          ),
        "resume-update"
      );
    }

    console.error("Resume save error:", {
      message: error.message,
      userId: user?.id,
      errorCode: "SAVE_FAILURE",
    });

    return {
      success: false,
      error: "Failed to save resume. Please try again.",
      errorCode: "SAVE_FAILURE",
    };
  }
}
