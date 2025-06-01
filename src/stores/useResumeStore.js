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
        techStack: [],
        projectLink: "",
        description: "",
      },
    ],
  },
  education: {
    educations: [
      {
        degree: "",
        major: "",
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
  hasWorkExperience: true,

  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export const useResumeStore = create(
  persist(
    (set, get) => ({
      resumes: {},
      currentResumeId: null,
      isSaving: false,
      isUploadingResume: false,
      setIsUploadingResume: (flag) => set({ isUploadingResume: flag }),
      addResume: () => {
        const id = uuidv4();
        const timestamp = new Date().toISOString();
        const resumeData = {
          ...JSON.parse(JSON.stringify(defaultResumeData)),
          createdAt: timestamp,
          updatedAt: timestamp,
        };
        set((state) => ({
          resumes: {
            ...state.resumes,
            [id]: resumeData,
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

      setHasWorkExperience: (flag) => {
        const { currentResumeId } = get();
        if (!currentResumeId) return;

        set((state) => ({
          resumes: {
            ...state.resumes,
            [currentResumeId]: {
              ...state.resumes[currentResumeId],
              hasWorkExperience: flag,
              updatedAt: new Date().toISOString(),
            },
          },
        }));
      },

      getHasWorkExperience: () => {
        const { currentResumeId, resumes } = get();
        if (!currentResumeId) return true;
        return resumes[currentResumeId]?.hasWorkExperience ?? true;
      },

      setResumeData: (updateFn) => {
        const { currentResumeId, resumes } = get();
        if (!currentResumeId) return;
        set((state) => {
          const updatedResume = updateFn(state.resumes[currentResumeId]);
          return {
            resumes: {
              ...state.resumes,
              [currentResumeId]: {
                ...updatedResume,
                updatedAt: new Date().toISOString(),
              },
            },
          };
        });
      },

      resetResumeData: () => {
        const { currentResumeId } = get();
        if (!currentResumeId) return;
        const timestamp = new Date().toISOString();
        set((state) => ({
          resumes: {
            ...state.resumes,
            [currentResumeId]: {
              ...JSON.parse(JSON.stringify(defaultResumeData)),
              createdAt: state.resumes[currentResumeId].createdAt,
              updatedAt: timestamp,
            },
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
