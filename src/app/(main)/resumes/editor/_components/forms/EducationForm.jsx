"use client";
import React, { useRef, useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { educationSchema } from "@/lib/formValidations";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PlusCircle, Trash2, ChevronUp, ChevronDown } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const EducationForm = ({ resumeData, setResumeData }) => {
  const timeoutRef = useRef();
  const [saveStatus, setSaveStatus] = useState(null);

  const form = useForm({
    resolver: zodResolver(educationSchema),
    defaultValues: {
      educations: resumeData.educations || [
        {
          degree: "",
          school: "",
          startDate: "",
          endDate: "",
        },
      ],
    },
  });

  const { fields, append, remove, swap } = useFieldArray({
    control: form.control,
    name: "educations",
  });

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

  const addNewEducation = () => {
    append({
      degree: "",
      school: "",
      startDate: "",
      endDate: "",
    });
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="space-y-1.5 text-center">
        <h2 className="text-2xl font-semibold">Education</h2>
        <p className="text-sm text-muted-foreground">
          Add your educational background
        </p>
      </div>
      <Form {...form}>
        <form className="space-y-6">
          {fields.map((item, index) => (
            <Card key={item.id}>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">
                  Education {index + 1}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name={`educations.${index}.degree`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Degree</FormLabel>
                      <FormControl>
                        <Input {...field} autoFocus placeholder="Bachelor of Science" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`educations.${index}.school`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>School/University</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Harvard University" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name={`educations.${index}.startDate`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Start Date</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Sep 2018" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`educations.${index}.endDate`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>End Date</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Jun 2022 or Present" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
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
            onClick={addNewEducation}
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Another Education
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default EducationForm;
