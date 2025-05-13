"use client";
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { generalInfoSchema } from "@/lib/formValidations";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useResumeStore } from "@/stores/useResumeStore";

const GeneralInfoForm = () => {
  const { currentResumeId, resumes, setResumeData } = useResumeStore();
  const timeoutRef = useRef();

const resumeData = resumes[currentResumeId] || {};

  const form = useForm({
    resolver: zodResolver(generalInfoSchema),
    defaultValues: {
      title: resumeData.generalInfo?.title || "",
      description: resumeData.generalInfo?.description || "",
    },
    mode: "onChange",
  });

  const [saveStatus, setSaveStatus] = useState(null);

  // Reset form when data changes
  useEffect(() => {
    if (resumeData.generalInfo) {
      const newValues = {
        title: resumeData.generalInfo.title || "",
        description: resumeData.generalInfo.description || "",
      };

      form.reset(newValues);
    }
  }, [resumeData.generalInfo, form]);

  // Handle form changes and auto-save
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
          const currentValues = resumeData.generalInfo;

          // Only update if values have actually changed
          const hasChanges = Object.keys(rawValues).some(
            (key) => rawValues[key] !== currentValues?.[key]
          );

          if (hasChanges) {
            setResumeData((prev) => ({
              ...prev,
              generalInfo: {
                ...prev.generalInfo,
                ...rawValues,
              },
            }));
            setSaveStatus("saved");
          } else {
            setSaveStatus(null);
          }
        } catch (error) {
          console.error("Error saving general info:", error);
          setSaveStatus("error");
        }
      }, 500);
    });

    return () => {
      subscription.unsubscribe();
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [form, resumeData.generalInfo, setResumeData]);

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="space-y-1.5 text-center">
        <h2 className="text-2xl font-semibold">General Info</h2>
        <p className="text-sm text-muted-foreground">
          This will not appear on your resume.
        </p>
      </div>

      <Form {...form}>
        <form className="space-y-2">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Project Name</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="My Cool Resume" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Project Description</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Resume for next job" />
                </FormControl>
                <FormDescription>
                  Describe what this resume is for.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </div>
  );
};

export default GeneralInfoForm;
