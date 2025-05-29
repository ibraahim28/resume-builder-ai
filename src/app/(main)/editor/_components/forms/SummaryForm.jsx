"use client";
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { summarySchema } from "@/lib/formValidations";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useResumeStore } from "@/stores/useResumeStore";
import { saveResume } from "../../_actions/saveResumeActions";
import toast from "react-hot-toast";
import GenerateSummaryBtn from "./generate-with-ai-btns/generateSummaryBtn";

const SummaryForm = () => {
  const { resumes, currentResumeId, setResumeData, setIsSaving } =
    useResumeStore();
  const resumeStore = useResumeStore;

  const resumeData = resumes[currentResumeId] || {};

  const form = useForm({
    resolver: zodResolver(summarySchema),
    defaultValues: {
      summary: resumeData.summary?.summary || "",
    },
    mode: "onChange",
  });

  const timeoutRef = useRef();
  const [saveStatus, setSaveStatus] = useState(null);

  useEffect(() => {
    if (resumeData.summary) {
      const newValues = {
        summary: resumeData.summary.summary || "",
      };

      form.reset(newValues);
    }
  }, [resumeData.summary, form]);

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
          const currentValues = resumeData.summary;

          const hasChanges = Object.keys(rawValues).some(
            (key) => rawValues[key] !== currentValues?.[key]
          );

          if (hasChanges) {
            setResumeData((prev) => ({
              ...prev,
              summary: {
                ...prev.summary,
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

            console.log("result---------------------", result);

            setIsSaving(false);
            setSaveStatus("saved");
          } else {
            setIsSaving(false);
            setSaveStatus(null);
          }
        } catch (error) {
          console.error("Error saving summary:", error);
          setIsSaving(false);
          setSaveStatus("error");
        }
      }, 2000);
    });

    return () => {
      subscription.unsubscribe();
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [form, resumeData.summary, setResumeData]);

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="space-y-1.5 text-center">
        <h2 className="text-2xl font-semibold">Professional Summary</h2>
        <p className="text-sm text-muted-foreground">
          Create a compelling summary of your qualifications or generate one with AI.
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
          <FormField
            control={form.control}
            name="summary"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between">
                  <FormLabel>Summary</FormLabel>
                  <GenerateSummaryBtn
                    resumes={resumes}
                    currentResumeId={currentResumeId}
                    onSummaryGenerated={(summary) =>
                      form.setValue("summary", summary, {
                        shouldDirty: true,
                        shouldTouch: true,
                        shouldValidate: true,
                      })
                    }
                  />
                </div>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Experienced software developer with 5+ years of expertise in web development..."
                    rows={6}
                  />
                </FormControl>
                <FormDescription>
                  Keep your summary concise (3-5 sentences) and highlight your
                  most relevant qualifications
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

export default SummaryForm;
