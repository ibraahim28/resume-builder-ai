"use client";

import { useEffect, useRef, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { projectsSchema, workExperienceSchema } from "@/lib/formValidations";
import { useResumeStore } from "@/stores/useResumeStore";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  PlusCircle,
  Trash2,
  ChevronUp,
  ChevronDown,
  GripHorizontal,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import toast from "react-hot-toast";

export default function ExperiencesForm() {
  const {
    resumes,
    currentResumeId,
    setResumeData,
    hasWorkExperience,
    setHasWorkExperience,
  } = useResumeStore();

  const resumeData = resumes[currentResumeId] || {};

  const timeoutRef = useRef();
  const [saveStatus, setSaveStatus] = useState(null);
   const [inputValue, setInputValue] = useState("");

  const defaultWorkExperiences = [
    {
      position: "",
      company: "",
      startDate: "",
      endDate: "",
      description: "",
    },
  ];

  const defaultProjects = [
    {
      title: "",
      projectLink: "",
      description: "",
    },
  ];

  const isFormEmpty = (entries) =>
    Array.isArray(entries) &&
    entries.every((entry) =>
      Object.values(entry).every((val) => !val || val.trim?.() === "")
    );

  const form = useForm({
    resolver: zodResolver(
      hasWorkExperience ? workExperienceSchema : projectsSchema
    ),
    defaultValues: hasWorkExperience
      ? {
          workExperiences:
            resumeData.workExperience?.workExperiences ||
            defaultWorkExperiences,
        }
      : {
          projects: resumeData.project?.projects || defaultProjects,
        },
    mode: "onChange",
  });

  useEffect(() => {
    const newValues = hasWorkExperience
      ? {
          workExperiences:
            resumeData?.workExperience?.workExperiences ||
            defaultWorkExperiences,
        }
      : {
          projects: resumeData?.project?.projects || defaultProjects,
        };

    form.reset(newValues);
  }, [hasWorkExperience, form, resumeData]);

  useEffect(() => {
    const subscription = form.watch((value, { name, type }) => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);

      timeoutRef.current = setTimeout(async () => {
        setSaveStatus("saving");
        try {
          const isValid = await form.trigger();

          if (!isValid) {
            setSaveStatus("error");
            return;
          }

          const rawValues = form.getValues();
          const currentValues = hasWorkExperience
            ? resumeData.workExperience
            : resumeData.project;

          const hasChanges = hasWorkExperience
            ? JSON.stringify(rawValues.workExperiences) !==
              JSON.stringify(currentValues?.workExperiences)
            : JSON.stringify(rawValues.projects) !==
              JSON.stringify(currentValues?.projects);

          if (hasChanges) {
            setResumeData((prev) => {
              if (hasWorkExperience) {
                return {
                  ...prev,
                  workExperience: {
                    ...prev.workExperience,
                    workExperiences: rawValues.workExperiences,
                  },
                };
              } else {
                return {
                  ...prev,
                  project: {
                    ...prev.project,
                    projects: rawValues.projects,
                  },
                };
              }
            });
            setSaveStatus("saved");
          } else {
            setSaveStatus(null);
          }
        } catch (error) {
          console.error("Error saving experiences:", error);
          setSaveStatus("error");
        }
      }, 1000);
    });

    return () => {
      subscription.unsubscribe();
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [form, resumeData, hasWorkExperience, setResumeData]);

  const { fields, append, remove, swap } = useFieldArray({
    control: form.control,
    name: hasWorkExperience ? "workExperiences" : "projects",
  });

  const handleToggleExperience = () => {
    const projects = form.getValues("projects") || [];
    if (!isFormEmpty(projects)) {
      toast.error("Please clear your projects before switching.");
      return;
    }

    setHasWorkExperience(true);
    form.reset({
      workExperiences:
        resumeData.workExperience?.workExperiences || defaultWorkExperiences,
    });
  };

  const handleToggleProjects = () => {
    const workExperiences = form.getValues("workExperiences") || [];
    if (!isFormEmpty(workExperiences)) {
      toast.error("Please clear your work experience before switching.");
      return;
    }

    setHasWorkExperience(false);
    form.reset({
      projects: resumeData.project?.projects || defaultProjects,
    });
  };

  return (
    <div
      key={hasWorkExperience ? "work" : "projects"}
      className="max-w-xl mx-auto space-y-6"
    >
      <div className="space-y-1.5 text-center">
        <h2 className="text-2xl font-semibold">
          {hasWorkExperience ? "Work Experience" : "Projects"}
        </h2>
        <p className="text-sm text-muted-foreground">
          {hasWorkExperience
            ? "Add your work history and professional experience"
            : "Add projects to highlight your skills and portfolio"}
        </p>
        {saveStatus === "saving" && (
          <p className="text-xs text-amber-500">Saving...</p>
        )}
        {saveStatus === "saved" && (
          <p className="text-xs text-green-500">All changes saved</p>
        )}
        {saveStatus === "error" && (
          <p className="text-xs text-red-500">
            Validation error - please check form fields
          </p>
        )}
      </div>

      <div className="flex justify-center gap-4">
        <Button
          type="button"
          variant={hasWorkExperience ? "outline" : "default"}
          onClick={handleToggleExperience}
        >
          I have Work Experience
        </Button>
        <Button
          type="button"
          variant={!hasWorkExperience ? "outline" : "default"}
          onClick={handleToggleProjects}
        >
          I want to add Projects
        </Button>
      </div>

      <Form {...form}>
        <form className="space-y-6">
          {fields.map((item, index) => (
            <Card key={item.id}>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium flex items-center justify-between">
                  {hasWorkExperience
                    ? `Experience ${index + 1}`
                    : `Project ${index + 1}`}
                  <GripHorizontal className="text-muted-foreground cursor-grab" />
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name={
                    hasWorkExperience
                      ? `workExperiences.${index}.position`
                      : `projects.${index}.title`
                  }
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {hasWorkExperience ? "Position" : "Project Title"}
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder={
                            hasWorkExperience
                              ? "Software Engineer"
                              : "My Portfolio Site"
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {hasWorkExperience ? (
                  <>
                    <FormField
                      control={form.control}
                      name={`workExperiences.${index}.company`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Company</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Google Inc." />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name={`workExperiences.${index}.startDate`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Start Date</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                type={"date"}
                                placeholder="Jan 2023"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`workExperiences.${index}.endDate`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>End Date</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                type={"date"}
                                placeholder="Dec 2024"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <FormField
                      control={form.control}
                      name={`projects.${index}.techStack`}
                      render={({ field }) => {

                        const techStackArray = field.value || [];

                        const handleKeyDown = (e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            const newTech = inputValue.trim();
                            if (newTech && !techStackArray.includes(newTech)) {
                              field.onChange([...techStackArray, newTech]);
                              setInputValue("");
                            }
                          }
                        };

                        const removeTech = (techToRemove) => {
                          const filtered = techStackArray.filter(
                            (t) => t !== techToRemove
                          );
                          field.onChange(filtered);
                        };

                        return (
                          <>
                            <FormItem>
                              <FormLabel>Tech Stack</FormLabel>
                              <FormControl>
                                <Input
                                  value={inputValue}
                                  onChange={(e) =>
                                    setInputValue(e.target.value)
                                  }
                                  onKeyDown={handleKeyDown}
                                  placeholder="Add tech stack and press Enter"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                            <FormDescription>
                              Add at least 3 - 4 technologies you used to develop
                              this project
                            </FormDescription>
                            {/* Preview added tech stacks */}
                            <div className="flex flex-wrap gap-2 mt-2">
                              {techStackArray.map((tech) => (
                                <div
                                  key={tech}
                                  className="flex items-center bg-blue-100 text-blue-800 rounded-full px-3 py-1 text-sm"
                                >
                                  <span>{tech}</span>
                                  <button
                                    type="button"
                                    className="ml-2 text-blue-600 hover:text-blue-900"
                                    onClick={() => removeTech(tech)}
                                    aria-label={`Remove ${tech}`}
                                  >
                                    &times;
                                  </button>
                                </div>
                              ))}
                            </div>
                          </>
                        );
                      }}
                    />

                    <FormField
                      control={form.control}
                      name={`projects.${index}.projectLink`}
                      render={({ field }) => (
                        <>
                          <FormItem>
                            <FormLabel>Project Link</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="https://yourapp.com"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                          <FormDescription>
                            This link will be attached to the title of yout
                            project.
                          </FormDescription>
                        </>
                      )}
                    />
                  </>
                )}
                <FormField
                  control={form.control}
                  name={
                    hasWorkExperience
                      ? `workExperiences.${index}.description`
                      : `projects.${index}.description`
                  }
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea {...field} rows={4} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter className="flex justify-between border-t pt-3">
                <div className="flex gap-2">
                  {index > 0 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => swap(index, index - 1)}
                    >
                      <ChevronUp className="h-4 w-4" />
                    </Button>
                  )}
                  {index < fields.length - 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => swap(index, index + 1)}
                    >
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => remove(index)}
                  disabled={fields.length === 1}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Remove
                </Button>
              </CardFooter>
            </Card>
          ))}

          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() =>
              hasWorkExperience
                ? append(defaultWorkExperiences[0])
                : append(defaultProjects[0])
            }
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Another {hasWorkExperience ? "Experience" : "Project"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
