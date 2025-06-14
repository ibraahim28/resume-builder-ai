"use client";
import React, { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { skillsSchema } from "@/lib/formValidations";
import {
  Form,
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { useResumeStore } from "@/stores/useResumeStore";
import { saveResume } from "../../_actions/saveResumeActions";
import toast from "react-hot-toast";

const SkillsForm = () => {
  const [newSkill, setNewSkill] = useState("");
  const [saveStatus, setSaveStatus] = useState("null");
  const timeoutRef = useRef();
  const { resumes, currentResumeId, setResumeData, setIsSaving } =
    useResumeStore();
  const resumeStore = useResumeStore;

  const resumeData = resumes?.[currentResumeId] || {};

  const form = useForm({
    resolver: zodResolver(skillsSchema),
    defaultValues: {
      skills: resumeData?.skills?.skills || [],
    },
  });

  useEffect(() => {
    if (resumeData?.skills) {
      form.reset({
        skills: resumeData?.skills?.skills || [],
      });
    }
  }, [resumeData?.skills, form]);

  const skills = form.getValues("skills");

  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);

      timeoutRef.current = setTimeout(async () => {
        setIsSaving?.(true);
        setSaveStatus("saving");

        try {
          const isValid = await form.trigger("skills");

          if (!isValid) {
            setIsSaving?.(false);
            setSaveStatus("error");
            return;
          }

          const rawValues = form.getValues();
          const currentValues = resumeData?.skills;

          const hasChanges =
            JSON.stringify(rawValues?.skills) !==
            JSON.stringify(currentValues?.skills);

          if (hasChanges) {
            setResumeData?.((prev) => ({
              ...prev,
              skills: {
                ...prev?.skills,
                skills: rawValues?.skills,
              },
            }));

            const updatedResumes = resumeStore?.getState?.()?.resumes;

            const result = await saveResume?.(
              currentResumeId,
              updatedResumes?.[currentResumeId]
            );

            if (!result?.success) {
              toast.error("Error saving Resume");
              setIsSaving?.(false);
              setSaveStatus("error");
              return;
            }

            setIsSaving?.(false);
            setSaveStatus("saved");
          } else {
            setIsSaving?.(false);
            setSaveStatus(null);
          }
        } catch (error) {
          console.error("Error saving skills:", error);
          setIsSaving?.(false);
          setSaveStatus("error");
        }
      }, 2000);
    });

    return () => {
      subscription.unsubscribe();
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [form, resumeData?.skills, setResumeData]);

  const addSkill = () => {
    if (newSkill.trim() && !skills?.includes(newSkill.trim())) {
      const updatedSkills = [...(skills || []), newSkill.trim()];
      form.setValue("skills", updatedSkills);
      setNewSkill("");
    }
  };

  const removeSkill = (skillToRemove) => {
    const updatedSkills = skills?.filter((skill) => skill !== skillToRemove);
    form.setValue("skills", updatedSkills || []);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSkill();
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="space-y-1.5 text-center">
        <h2 className="text-2xl font-semibold">Skills</h2>
        <p className="text-sm text-muted-foreground">
          Add your technical and professional skills
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

      <Form {...form}>
        <form className="space-y-4">
          <div className="flex space-x-2 items-center">
            <FormItem className="flex-1">
              <FormLabel>Add Skill</FormLabel>
              <FormControl>
                <Input
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="React.js"
                />
              </FormControl>
              <FormDescription>
                Press enter or click Add after typing each skill
              </FormDescription>
            </FormItem>
            <Button type="button" onClick={addSkill} className="mb-2">
              Add
            </Button>
          </div>

          <div className="mt-6">
            <h3 className="text-sm font-medium mb-2">Your Skills:</h3>
            <div className="flex flex-wrap gap-2">
              {skills?.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No skills added yet
                </p>
              ) : (
                skills?.map((skill, index) => (
                  <Badge key={index} variant="secondary" className="px-3 py-1">
                    {skill}
                    <button
                      type="button"
                      onClick={() => removeSkill(skill)}
                      className="ml-2"
                    >
                      <X className="h-3 w-3 cursor-pointer" />
                    </button>
                  </Badge>
                ))
              )}
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default SkillsForm;
