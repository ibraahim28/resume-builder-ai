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
import { useResumeStore } from "@/stores/useResumeStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRef, useState, useEffect } from "react";
import { useForm } from "react-hook-form";

export default function PersonalInfoForm() {
  const [saveStatus, setSaveStatus] = useState(null);
  const photoInputRef = useRef(null);
  const {resumeData, setResumeData} = useResumeStore();

  const form = useForm({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      firstName: resumeData.personalInfo?.firstName || "",
      lastName: resumeData.personalInfo?.lastName || "",
      jobTitle: resumeData.personalInfo?.jobTitle || "",
      city: resumeData.personalInfo?.city || "",
      country: resumeData.personalInfo?.country || "",
      phone: resumeData.personalInfo?.phone || "",
      email: resumeData.personalInfo?.email || "",
      photo: resumeData.personalInfo?.photo || null,
    },    
  });

  const timeoutRef = useRef();

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

           console.log("rawValues", rawValues)
           setResumeData((prev) => ({
            ...prev,
            personalInfo: {
              ...prev.personalInfo,
              ...rawValues, 
            },
          }));
          
           setSaveStatus("saved");
         } catch (error) {
           console.error("Error saving general info:", error);
           setSaveStatus("error");
         }
       }, 2000);
     });
   

    return () => {
      subscription.unsubscribe();
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [form, setResumeData]);
  

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div className="space-y-1.5 text-center">
        <h2 className="text-2xl font-semibold">Personal info</h2>
        <p className="text-sm text-muted-foreground">Tell us about yourself.</p>
        {/* {saveStatus === "saving" && (
          <p className="text-xs text-amber-500">Saving...</p>
        )}
        {saveStatus === "saved" && (
          <p className="text-xs text-green-500">All changes saved</p>
        )}
        {saveStatus === "error" && (
          <p className="text-xs text-red-500">
            Validation error - please check form fields
          </p>
        )} */}
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
                    <Input placeholder="John" autoFocus  {...field} />
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
                    <Input placeholder="Doe" {...field} />
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
                  <Input placeholder="Data Analyst" {...field} />
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
                    <Input placeholder="Karachi" {...field} />
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
                    <Input placeholder="Pakistan" {...field} />
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
                  <Input placeholder="+92 123 456 7890" {...field} type="tel" />
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
                  <Input placeholder="johndoe@email.com" {...field} type="email" />
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
