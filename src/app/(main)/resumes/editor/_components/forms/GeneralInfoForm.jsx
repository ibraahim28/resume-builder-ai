"use client";
import React, { useEffect, useState } from "react";
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

const GeneralInfoForm = ({ resumeData = {}, setResumeData }) => {
  const form = useForm({
    resolver: zodResolver(generalInfoSchema),
    defaultValues: {
      title: resumeData.title || "",
      description: resumeData.desciption || "",
    },
  });

  const [saveStatus, setSaveStatus] = useState(null);

  // Auto-save whenever form values change

  const watchedFields = form.watch([
    "firstName",
    "lastName",
    "jobTitle",
    "city",
    "country",
    "phone",
    "email",
    "photo",
  ]);

  useEffect(() => {
    const saveFormData = async () => {
      if (Object.keys(form.formState.dirtyFields).length > 0) {
        setSaveStatus("saving");

        try {
          await form.trigger();
          if (Object.keys(form.formState.errors).length > 0) {
            setSaveStatus("error");
            return;
          }

          setResumeData((prev) => ({
            ...prev,
            ...form.getValues(), // get final values
          }));
          console.log(form.getValues());
          setSaveStatus("saved");
        } catch (error) {
          console.error("Error saving form:", error);
          return setSaveStatus("error");
        }
      }
    };

    const timeoutId = setTimeout(saveFormData, 1000);
    return () => clearTimeout(timeoutId);
  }, [watchedFields, setResumeData]);

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
                  <Input {...field} placeholder="My Cool Resume" autoFocus />
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
