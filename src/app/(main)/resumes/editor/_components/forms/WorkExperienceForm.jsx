"use client";
import React, { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { workExperienceSchema } from "@/lib/formValidations";
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
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { PlusCircle, Trash2, ChevronUp, ChevronDown } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const WorkExperienceForm = ({ defaultValues, onSubmit }) => {
  const form = useForm({
    resolver: zodResolver(workExperienceSchema),
    defaultValues: defaultValues || {
      workExperiences: [
        {
          position: "",
          company: "",
          startDate: "",
          endDate: "",
          description: "",
        },
      ],
    },
  });

  // Initialize field array
  const { fields, append, remove, swap } = useFieldArray({
    control: form.control,
    name: "workExperiences",
  });

  const handleSubmit = (data) => {
    if (onSubmit) onSubmit(data);
  };

  const addNewExperience = () => {
    append({
      position: "",
      company: "",
      startDate: "",
      endDate: "",
      description: "",
    });
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="space-y-1.5 text-center">
        <h2 className="text-2xl font-semibold">Work Experience</h2>
        <p className="text-sm text-muted-foreground">
          Add your work history and professional experience
        </p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          {fields.map((item, index) => (
            <Card key={item.id} className="relative">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">
                  Experience {index + 1}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name={`workExperiences.${index}.position`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Position</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Senior Frontend Developer" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
                          <Input {...field} placeholder="Mar 2020" />
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
                          <Input {...field} placeholder="Apr 2023 or Present" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name={`workExperiences.${index}.description`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Describe your responsibilities, achievements, and key projects"
                          rows={4}
                        />
                      </FormControl>
                      <FormDescription>
                        Use bullet points by starting lines with • or - for better readability
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter className="flex justify-between border-t pt-3">
                <div className="flex space-x-2">
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
                  onClick={() => fields.length > 1 && remove(index)}
                  disabled={fields.length <= 1}
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
            onClick={addNewExperience}
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Another Experience
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default WorkExperienceForm;