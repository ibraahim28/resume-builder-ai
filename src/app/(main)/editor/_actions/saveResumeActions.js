"use server";

import { partialResumeSchema } from "@/lib/formValidations";
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

    parsed = partialResumeSchema.parse(values);

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
        await deleteFromCloudinary(existingResume.personalInfo.photo);
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
    console.error("Resume save error:", {
      message: error.message,
      stack: error.stack,
      rawValues: values,
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
