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
import { useRef, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { saveResume } from "../../_actions/saveResumeActions";
import toast from "react-hot-toast";

export default function PersonalInfoForm() {
  const photoInputRef = useRef(null);
  const { resumes, currentResumeId, setResumeData, setIsSaving } =
    useResumeStore();
  const resumeStore = useResumeStore;
  const timeoutRef = useRef();
  const [saveStatus, setSaveStatus] = useState("null");

  const resumeData = resumes[currentResumeId] || {};

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
    mode: "onChange",
  });

  const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  useEffect(() => {
    if (resumeData.personalInfo) {
      const newValues = {
        firstName: resumeData.personalInfo.firstName || "",
        lastName: resumeData.personalInfo.lastName || "",
        jobTitle: resumeData.personalInfo.jobTitle || "",
        city: resumeData.personalInfo.city || "",
        country: resumeData.personalInfo.country || "",
        phone: resumeData.personalInfo.phone || "",
        email: resumeData.personalInfo.email || "",
        photo: resumeData.personalInfo.photo || null,
      };

      form.reset(newValues);
    }
  }, [resumeData.personalInfo, form]);

  useEffect(() => {
    const subscription = form.watch((value, { name, type }) => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);

      timeoutRef.current = setTimeout(async () => {
        setIsSaving(true);
        setSaveStatus("saving");
        try {
          const isValid = await form.trigger(name);

          if (!isValid) {
            setIsSaving(false);
            setSaveStatus("error");
            return;
          }

          const rawValues = form.getValues();
          const currentValues = resumeData.personalInfo;

          let photoValue = rawValues.photo;
          if (photoValue instanceof File) {
            try {
              photoValue = await convertFileToBase64(photoValue);
            } catch (error) {
              console.error("Error converting photo to base64:", error);
              return;
            }
          }

          const hasChanges = Object.keys(rawValues).some(
            (key) => rawValues[key] !== currentValues?.[key]
          );

          if (hasChanges) {
            setResumeData((prev) => ({
              ...prev,
              personalInfo: {
                ...prev.personalInfo,
                ...rawValues,
                photo: photoValue,
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
          setIsSaving(false);
          setSaveStatus("error");
          console.error("Error saving personal info:", error);
        }
      }, 1000);
    });

    return () => {
      subscription.unsubscribe();
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [form, resumeData.personalInfo, setResumeData]);

  const handleRemovePhoto = async () => {
    setIsSaving(true);
    setSaveStatus("saving");
    try {
      if (photoInputRef.current) {
        photoInputRef.current.value = "";
      }
      form.setValue("photo", null);
      setResumeData((prev) => ({
        ...prev,
        personalInfo: {
          ...prev.personalInfo,
          photo: null,
        },
      }));

      const updatedResumes = resumeStore.getState().resumes;

      const result = await saveResume(
        currentResumeId,
        updatedResumes[currentResumeId]
      );

      if (!result.success) {
        toast.error("Error saving Resume");
        setIsSaving(false);
        setSaveStatus("error");
        return;
      }

      setSaveStatus("saved");
    } catch (e) {
      console.error(e);
      setSaveStatus("error");
    } finally {
      setIsSaving(false);
    }
  };

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
                        fieldProps.ref?.(el);
                      }}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          onChange(file);
                        }
                      }}
                    />
                  </FormControl>
                  <Button
                    variant="secondary"
                    type="button"
                    onClick={handleRemovePhoto}
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
                    <Input placeholder="John" {...field} />
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
                  <Input
                    placeholder="johndoe@email.com"
                    {...field}
                    type="email"
                  />
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
