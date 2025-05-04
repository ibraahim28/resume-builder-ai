  import { create } from "zustand";

  export const useResumeStore = create((set) => ({
    resumeData: {
      generalInfo: {
        title: "",
        description: "",
      },
      personalInfo: {
        photo: null,
        firstName: "",
        lastName: "",
        jobTitle: "",
        city: "",
        country: "",
        phone: "",
        email: "",
      },
        workExperience:{
          workExperiences : []
        },

        project: {
          projects : []
        },

        education: {
          educations : []
        },

      skills: {
        skills: [],
      },
      summary: {
        summary: "",
      },
      appearance: {
        colorHex: "",
        borderStyle: "",
      },
    },
    setResumeData: (updateFn) =>
      set((state) => ({
        resumeData: updateFn(state.resumeData),
      })),
    resetResumeData: () =>
      set(() => ({
        resumeData: {
          generalInfo: {
            title: "",
            description: "",
          },
          personalInfo: {
            photo: null,
            firstName: "",
            lastName: "",
            jobTitle: "",
            city: "",
            country: "",
            phone: "",
            email: "",
          },
          workExperience: {
            workExperiences: [],
          },
          projects: {
            projects: [],
          },
          education: {
            educations: [],
          },
          skills: {
            skills: [],
          },
          summary: {
            summary: "",
          },
          appearance: {
            colorHex: "",
            borderStyle: "",
          },
        },
      })),

    hasWorkExperience: true,
    setHasWorkExperience: (flag) => set({ hasWorkExperience: flag }),
  }));
