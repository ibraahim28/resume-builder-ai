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

const SummaryForm = ({ resumeData, setResumeData }) => {
  const form = useForm({
    resolver: zodResolver(summarySchema),
    defaultValues: resumeData?.summary || {
      summary: "",
    },
  });

  const timeoutRef = useRef();
  const [saveStatus, setSaveStatus] = useState(null);

  useEffect(() => {
    const subscription = form.watch((value, { name, type }) => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);

      timeoutRef.current = setTimeout(async () => {
        setSaveStatus("saving");
        try {
          const isValid = await form.trigger(); // Validate current form

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
          console.error("Error saving work experiences:", error);
          setSaveStatus("error");
        }
      }, 2000); // 2 seconds debounce
    });

    return () => {
      subscription.unsubscribe();
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [form, setResumeData]);

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="space-y-1.5 text-center">
        <h2 className="text-2xl font-semibold">Professional Summary</h2>
        <p className="text-sm text-muted-foreground">
          Create a compelling summary of your qualifications and experience.
        </p>
      </div>
      <Form {...form}>
        <form className="space-y-4">
          {/* {onGenerateSummary && (
            <Button
              type="button"
              variant="outline"
              className="w-full mb-2"
              onClick={onGenerateSummary}
            >
              <Wand2 className="h-4 w-4 mr-2" />
              Generate Summary
            </Button>
          )} */}

          <FormField
            control={form.control}
            name="summary"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Summary</FormLabel>
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
