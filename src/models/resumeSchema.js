import mongoose from "mongoose";

const { Schema, model, models } = mongoose;

const workExperienceSchema = new Schema({
  position: { type: String, trim: true },
  company: { type: String, trim: true },
  startDate: { type: String, trim: true },
  endDate: { type: String, trim: true },
  description: { type: String, trim: true },
});

const educationSchema = new Schema({
  degree: { type: String, trim: true },
  school: { type: String, trim: true },
  startDate: { type: String, trim: true },
  endDate: { type: String, trim: true },
});

const resumeSchema = new Schema(
  {
    // General Info
    title: { type: String, trim: true },
    description: { type: String, trim: true },

    // Personal Info
    photo: { type: String, default: null }, 
    firstName: { type: String, trim: true },
    lastName: { type: String, trim: true },
    jobTitle: { type: String, trim: true },
    city: { type: String, trim: true },
    country: { type: String, trim: true },
    phone: { type: String, trim: true },
    email: { type: String, trim: true },

    // Work Experiences
    workExperiences: [workExperienceSchema],

    // Educations
    educations: [educationSchema],

    // Skills
    skills: [{ type: String, trim: true }],

    // Summary
    summary: { type: String, trim: true },

    // Design Options
    colorHex: { type: String, trim: true },
    borderStyle: { type: String, trim: true },


    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const Resume = models.Resume || model("Resume", resumeSchema);
export default Resume;
