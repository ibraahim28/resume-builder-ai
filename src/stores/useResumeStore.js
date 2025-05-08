import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useResumeStore = create(
  persist(
    (set) => ({
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
      },
      hasWorkExperience: true,
      isSaving: false,

      setIsSaving : (flag) => set({isSaving : flag}),
      saveResumeData: async (sectionToUpdate, form) => {
        set({ isSaving: true });

        try {
          // Validate the form
          const isValid = await form.trigger();
          if (!isValid) {
            set({ isSaving: false });
            return false;
          }

          // Get form values
          const values = form.getValues();
          
          // Determine which section to update based on the current step
          let updatedSection;

          switch (sectionToUpdate) {
            case "general-info":
              updatedSection = { generalInfo: values.generalInfo };
              break;
            case "personal-info":
              updatedSection = { personalInfo: values.personalInfo };
              break;
            case "workExperience":
              updatedSection = {
                workExperience: { workExperiences: values.workExperiences },
              };
              break;
            case "project":
              updatedSection = { project: { projects: values.projects } };
              break;
            case "education":
              updatedSection = { education: { educations: values.educations } };
              break;
            case "skills":
              updatedSection = { skills: { skills: values.skills } };
              break;
            case "summary":
              updatedSection = { summary: { summary: values.summary } };
              break;
            case "appearance":
              updatedSection = { appearance: values.appearance };
              break;
            default:
              set({ isSaving: false });
              return false;
          }

          // Update the resume data with the new section
          set((state) => ({
            resumeData: {
              ...state.resumeData,
              ...updatedSection,
            },
          }));

          console.log(`Successfully saved ${sectionToUpdate} data`);
          return true;
        } catch (error) {
          console.error("Error saving resume data:", error);
          return false;
        } finally {
          set({ isSaving: false });
        }
      },

      setHasWorkExperience: (flag) => set({ hasWorkExperience: flag }),
      
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
            project: {
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
    }),
    {
      name: "resume-storage", 
      partialize: (state) => ({
        resumeData: state.resumeData,
        currentStep: state.currentStep 
      })
    }
  )
);