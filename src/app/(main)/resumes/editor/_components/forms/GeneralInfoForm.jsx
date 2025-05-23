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
import { saveResume } from "../../_actions/saveResumeActions";
import toast from "react-hot-toast";

const GeneralInfoForm = () => {
  const { currentResumeId, resumes, setResumeData, setIsSaving } =
    useResumeStore();
  const resumeStore = useResumeStore;
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

  useEffect(() => {
    if (resumeData.generalInfo) {
      const newValues = {
        title: resumeData.generalInfo.title || "",
        description: resumeData.generalInfo.description || "",
      };

      form.reset(newValues);
    }
  }, [resumeData.generalInfo, form]);

  useEffect(() => {
    const subscription = form.watch((value, { name, type }) => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);

      timeoutRef.current = setTimeout(async () => {
        setIsSaving(true);
        setSaveStatus("saving");
        try {
          const isValid = await form.trigger();

          if (!isValid) {
            setIsSaving(false);
            setSaveStatus("error");
            return;
          }

          const rawValues = form.getValues();
          const currentValues = resumeData.generalInfo;

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
            const updatedResumes = resumeStore.getState().resumes;
            console.log(
              "updatedStoreResume-----------------",
              updatedResumes[currentResumeId]
            );

            const result = await saveResume(
              currentResumeId,
              updatedResumes[currentResumeId]
            );

            if (!result.success) {
              toast.error("Error saving Resume");
              setIsSaving(false);
              setSaveStatus("error");
            }

            setIsSaving(false);
            setSaveStatus("saved");
          } else {
            setIsSaving(false);
            setSaveStatus(null);
          }
        } catch (error) {
          console.error("Error saving general info:", error);
          setIsSaving(false);
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
