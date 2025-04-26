"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { personalInfoSchema } from "@/lib/formValidations";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRef, useState, useEffect } from "react";
import { useForm } from "react-hook-form";

export default function PersonalInfoForm({ resumeData = {}, setResumeData }) {
  const [saveStatus, setSaveStatus] = useState(null); // null, 'saving', 'saved', 'error'
  const photoInputRef = useRef(null);

  // Assuming you've already defined photo validation in your personalInfoSchema
  // If not, you should update it in @/lib/formValidations.js

  const form = useForm({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      firstName: resumeData.firstName || "",
      lastName: resumeData.lastName || "",
      jobTitle: resumeData.jobTitle || "",
      city: resumeData.city || "",
      country: resumeData.country || "",
      phone: resumeData.phone || "",
      email: resumeData.email || "",
      photo: resumeData.photo || null,
    },
  });

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

  // useEffect(()=>{
  //   const {unsubscribe}= form.watch(async () => {
  //     const isValid = await form.trigger();
  //     if (!isValid) return;

  //     //save data
  //   })
  //   return unsubscribe;
  // },[form])

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div className="space-y-1.5 text-center">
        <h2 className="text-2xl font-semibold">Personal info</h2>
        <p className="text-sm text-muted-foreground">Tell us about yourself.</p>
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
        <form className="space-y-3">
          <FormField
            control={form.control}
            name="photo"
            render={({ field: { value, onChange, ...fieldProps } }) => (
              <FormItem>
                <FormLabel>Your photo</FormLabel>
                <div className="flex items-center gap-2">
                  <FormControl>
                    <Input
                      {...fieldProps}
                      type="file"
                      accept="image/*"
                      ref={(el) => {
                        photoInputRef.current = el;
                        fieldProps.ref?.(el); // connect with RHF
                      }}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        onChange(file); // Let react-hook-form handle the value
                      }}
                    />
                  </FormControl>
                  <Button
                    variant="secondary"
                    type="button"
                    onClick={() => {
                      if (photoInputRef.current) {
                        photoInputRef.current.value = "";
                      }
                      onChange(null); // Clear the value in react-hook-form
                    }}
                  >
                    Remove
                  </Button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-3">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="jobTitle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Job title</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-3">
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Country</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input {...field} type="tel" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input {...field} type="email" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </div>
  );
}
