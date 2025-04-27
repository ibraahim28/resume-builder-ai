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

const SkillsForm = ({ resumeData = {}, setResumeData }) => {
  const [newSkill, setNewSkill] = useState("");
  const [saveStatus, setSaveStatus] = useState("idle");
  const timeoutRef = useRef();

  const form = useForm({
    resolver: zodResolver(skillsSchema),
    defaultValues: resumeData?.skills || {
      skills: [],
    },
  });
  console.log(resumeData.skills);
  const skills = form.watch("skills") || [];

  // Autosave effect with debounce
  useEffect(() => {
    const subscription = form.watch(() => {
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
          setResumeData((prev) => ({
            ...prev,
            ...rawValues,
          }));

          console.log(rawValues);
          setSaveStatus("saved");
        } catch (error) {
          console.error("Error saving skills:", error);
          setSaveStatus("error");
        }
      }, 2000);
    });

    return () => {
      subscription.unsubscribe();
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [form, setResumeData]);

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      const updatedSkills = [...skills, newSkill.trim()];
      form.setValue("skills", updatedSkills);
      setNewSkill("");
    }
  };

  const removeSkill = (skillToRemove) => {
    const updatedSkills = skills.filter((skill) => skill !== skillToRemove);
    form.setValue("skills", updatedSkills);
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
      </div>

      <Form {...form}>
        <form className="space-y-4">
          <div className="flex space-x-2 items-center">
            <FormItem className="flex-1">
              <FormLabel>Add Skill</FormLabel>
              <FormControl>
                <Input
                  autoFocus
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
              {skills.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No skills added yet
                </p>
              ) : (
                skills.map((skill, index) => (
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

          {/* Save Status Indicator */}
          {/* <div className="text-xs text-muted-foreground mt-4">
            {saveStatus === "saving" && (
              <span className="text-blue-500">Saving...</span>
            )}
            {saveStatus === "saved" && (
              <span className="text-green-500">Saved ✅</span>
            )}
            {saveStatus === "error" && (
              <span className="text-red-500">Error saving ❌</span>
            )}
          </div> */}
        </form>
      </Form>
    </div>
  );
};

export default SkillsForm;
