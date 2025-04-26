"use client";
import React, { useState } from "react";
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

const SkillsForm = ({ defaultValues, onSubmit }) => {
  const [newSkill, setNewSkill] = useState("");

  const form = useForm({
    resolver: zodResolver(skillsSchema),
    defaultValues: defaultValues || {
      skills: [],
    },
  });

  const skills = form.watch("skills") || [];

  const handleSubmit = (data) => {
    if (onSubmit) onSubmit(data);
  };

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
      <div className="space-y-1.5 text-center  items-start">
        <h2 className="text-2xl font-semibold">Skills</h2>
        <p className="text-sm text-muted-foreground">
          Add your technical and professional skills
        </p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <div className="flex space-x-2 items-center">
            <FormItem className="flex-1 it">
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
        </form>
      </Form>
    </div>
  );
};

export default SkillsForm;
