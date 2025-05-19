"use server";

import { resumeSchema } from "@/lib/formValidations";
import Resume from "@/models/Resume";
import { currentUser } from "@clerk/nextjs/server";
import { uploadToCloudinary, deleteFromCloudinary } from "@/lib/cloudinary";

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
        await deleteFromCloudinary(existingResume.personalInfo.photo);
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
    console.error("Resume save error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
