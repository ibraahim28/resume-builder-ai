"use client";
import React from "react";
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
import { Button } from "@/components/ui/button";
import { Wand2 } from "lucide-react";

const SummaryForm = ({ defaultValues, onSubmit, onGenerateSummary }) => {
  const form = useForm({
    resolver: zodResolver(summarySchema),
    defaultValues: defaultValues || {
      summary: "",
    },
  });

  const handleSubmit = (data) => {
    if (onSubmit) onSubmit(data);
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="space-y-1.5 text-center">
        <h2 className="text-2xl font-semibold">Professional Summary</h2>
        <p className="text-sm text-muted-foreground">
          Create a compelling summary of your qualifications and experience{" "}
          <br /> or let the AI generate one based on your entered Data.
        </p>
      </div>
      <Form {...form}>
        <form className="space-y-4">
          {onGenerateSummary && (
            <Button
              type="button"
              variant="outline"
              className="w-full mb-2"
              onClick={onGenerateSummary}
            >
              <Wand2 className="h-4 w-4 mr-2" />
              Generate Summary
            </Button>
          )}

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
