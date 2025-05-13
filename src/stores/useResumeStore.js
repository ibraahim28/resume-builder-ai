import { create } from "zustand";
import { persist } from "zustand/middleware";
import { v4 as uuidv4 } from "uuid";

const defaultResumeData = {
  generalInfo: { title: "", description: "" },
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
    workExperiences: [
      {
        position: "",
        company: "",
        startDate: "",
        endDate: "",
        description: "",
      },
    ],
  },
  project: {
    projects: [
      {
        title: "",
        projectLink: "",
        description: "",
      },
    ],
  },
  education: {
    educations: [
      {
        degree: "",
        school: "",
        startDate: "",
        endDate: "",
      },
    ],
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
};

export const useResumeStore = create(
  persist(
    (set, get) => ({
      resumes: {}, 
      currentResumeId: null,
      hasWorkExperience: true,
      isSaving: false,

      // Create new resume and set as current
      addResume: () => {
        const id = uuidv4();
        set((state) => ({
          resumes: {
            ...state.resumes,
            [id]: JSON.parse(JSON.stringify(defaultResumeData)),
          },
          currentResumeId: id,
        }));
      },

      deleteResume: (id) => {
        set((state) => {
          const updated = { ...state.resumes };
          delete updated[id];
          return {
            resumes: updated,
            currentResumeId:
              state.currentResumeId === id ? null : state.currentResumeId,
          };
        });
      },

      setCurrentResumeId: (id) => set({ currentResumeId: id }),

      setIsSaving: (flag) => set({ isSaving: flag }),

      setHasWorkExperience: (flag) => set({ hasWorkExperience: flag }),

      // saveResumeData: async (sectionToUpdate, form) => {
      //   const { currentResumeId, resumes } = get();
      //   if (!currentResumeId) return false;

      //   set({ isSaving: true });
      //   try {
      //     const isValid = await form.trigger();
      //     if (!isValid) {
      //       set({ isSaving: false });
      //       return false;
      //     }

      //     const values = form.getValues();
      //     let updatedSection;

      //     switch (sectionToUpdate) {
      //       case "general-info":
      //         updatedSection = { generalInfo: values.generalInfo };
      //         break;
      //       case "personal-info":
      //         updatedSection = { personalInfo: values.personalInfo };
      //         break;
      //       case "workExperience":
      //         updatedSection = {
      //           workExperience: { workExperiences: values.workExperiences },
      //         };
      //         break;
      //       case "project":
      //         updatedSection = { project: { projects: values.projects } };
      //         break;
      //       case "education":
      //         updatedSection = { education: { educations: values.educations } };
      //         break;
      //       case "skills":
      //         updatedSection = { skills: { skills: values.skills } };
      //         break;
      //       case "summary":
      //         updatedSection = { summary: { summary: values.summary } };
      //         break;
      //       case "appearance":
      //         updatedSection = { appearance: values.appearance };
      //         break;
      //       default:
      //         set({ isSaving: false });
      //         return false;
      //     }

      //     // Update the correct resume by ID
      //     set((state) => ({
      //       resumes: {
      //         ...state.resumes,
      //         [currentResumeId]: {
      //           ...state.resumes[currentResumeId],
      //           ...updatedSection,
      //         },
      //       },
      //     }));

      //     console.log(
      //       `Saved section ${sectionToUpdate} to resume ${currentResumeId}`
      //     );
      //     return true;
      //   } catch (error) {
      //     console.error("Error saving resume data:", error);
      //     return false;
      //   } finally {
      //     set({ isSaving: false });
      //   }
      // },

      setResumeData: (updateFn) => {
        const { currentResumeId, resumes } = get();
        if (!currentResumeId) return;

        set((state) => ({
          resumes: {
            ...state.resumes,
            [currentResumeId]: updateFn(state.resumes[currentResumeId]),
          },
        }));
      },

      resetResumeData: () => {
        const { currentResumeId } = get();
        if (!currentResumeId) return;

        set((state) => ({
          resumes: {
            ...state.resumes,
            [currentResumeId]: JSON.parse(JSON.stringify(defaultResumeData)),
          },
        }));
      },
    }),
    {
      name: "multi-resume-storage",
      partialize: (state) => ({
        resumes: state.resumes,
        currentResumeId: state.currentResumeId,
      }),
    }
  )
);
