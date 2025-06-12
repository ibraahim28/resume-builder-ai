"use server";

import { resumeSchema } from "@/lib/formValidations";
import Resume from "@/models/Resume";
import { currentUser } from "@clerk/nextjs/server";
import { uploadToCloudinary, deleteFromCloudinary } from "@/lib/cloudinary";
import connectToDatabase from "@/lib/db";

export async function saveResume(currentResumeId, values) {
  try {
    const user = await currentUser();
    if (!user) throw new Error("User not authenticated");
    const userId = user.id;

    await connectToDatabase();

    console.log("Values ==========================", values);

    const parsed = resumeSchema.parse(valuess);

    const existingResume = currentResumeId
      ? await Resume.findOne({ resumeId: currentResumeId, userId })
      : null;

    let photoUrl = parsed.personalInfo.photo;
    let cloudinaryResult = null;

    // Handle photo upload/removal
    if (photoUrl && photoUrl.startsWith("data:")) {
      if (existingResume?.personalInfo?.photo) {
        await deleteFromCloudinary(existingResume.personalInfo.photo);
      }

      // Upload new photo
      cloudinaryResult = await uploadToCloudinary(photoUrl, {
        public_id: `resume_${userId}_${currentResumeId}_${Date.now()}`,
        transformation: [{ width: 500, height: 500, crop: "limit" }],
      });

      photoUrl = cloudinaryResult.secure_url;
    } else if (photoUrl === null) {
      // If photo was removed
      if (existingResume?.personalInfo?.photo) {
        await withRetry(
          () => deleteFromCloudinary(existingResume.personalInfo.photo),
          "cloudinary-cleanup"
        );
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

    // update the resume if it exists, otherwise create a new one
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
    // Key changes implemented:
    const MAX_RETRIES = 3;
    const RETRY_DELAY = 1000;

    // Retry wrapper for critical operations
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

    // Enhanced database connection with verification
    await withRetry(async () => {
      const conn = await connectToDatabase();
      if (!conn) throw new Error("Database connection failed");
      return conn;
    }, "database-connection");

    // Cloudinary operations with retries
    await withRetry(
      () => deleteFromCloudinary(existingResume.personalInfo.photo),
      "cloudinary-delete"
    );

    // Database writes with retries
    resumeDoc = await withRetry(
      () =>
        Resume.findByIdAndUpdate(
          existingResume._id,
          { data: normalizedResume, updatedAt: now },
          { new: true }
        ),
      "resume-update"
    );

    // Detailed error logging without exposing sensitive data
    console.error("Resume save error:", {
      message: error.message,
      userId: user?.id,
      errorCode: "SAVE_FAILURE",
    });

    // User-friendly error response
    return {
      success: false,
      error: "Failed to save resume. Please try again.",
      errorCode: "SAVE_FAILURE",
    };
  }
}
