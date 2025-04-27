import EducationForm from "./EducationForm";
import GeneralInfoForm from "./GeneralInfoForm";
import PersonalInfoForm from "./PersonalInforForm";
import SkillsForm from "./SkillsForm";
import SummaryForm from "./SummaryForm";
import WorkExperienceForm from "./WorkExperienceForm";

export const steps = [
  {
    title: "General info",
    component: GeneralInfoForm,
    key: "general-info",
  },
  {
    title: "Personal info",
    component: PersonalInfoForm,
    key: "pesonal-info",
  },
  {
    title : "Work Experiences",
    component : WorkExperienceForm,
    key : "work-experiences"
  },
  {
    title : "Educations",
    component : EducationForm,
    key : "educations"
  },
  {
    title : "Skills",
    component : SkillsForm,
    key : "skills",
  },
  {
    title : "Summary",
    component : SummaryForm,
    key : "summary"
  }
  
];
