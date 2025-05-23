import LoadingButton from "@/components/LoadingButton";
import { Button } from "@/components/ui/button";
import { generateWorkExperienceSchema } from "@/lib/formValidations";
import { WandSparklesIcon } from "lucide-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { generateWorkExperience } from "../../../_actions/AiActions";
import {
  Dialog,
  DialogHeader,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";

const GenerateWorkExpBtn = ({ onWorkExperienceGenerated }) => {
  const [showInputDialog, setShowInputDialog] = useState(false);
  return (
    <>
      <Button
        variant={"default"}
        type="button"
        //TODO: block for non premium users
        onClick={() => setShowInputDialog(true)}
      >
        <WandSparklesIcon className="size-4" />
        Smart fill
      </Button>
      <InputDialog
        open={showInputDialog}
        onOpenChange={setShowInputDialog}
        onWorkExperienceGenerated={(workExperience) => {
          onWorkExperienceGenerated(workExperience);
          setShowInputDialog(false);
        }}
      />
    </>
  );
};

function InputDialog({ open, onOpenChange, onWorkExperienceGenerated }) {
  const form = useForm({
    resolver: zodResolver(generateWorkExperienceSchema),
    defaultValues: {
      description: "",
    },
  });

  async function onSubmit(input) {
    try {
      const response = await generateWorkExperience(input);
      onWorkExperienceGenerated(response);
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong. Please try again");
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Generate work experience</DialogTitle>
          <DialogDescription>
            Describe your work experience briefly and the AI will fill the form
            for you.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <div className="space-y-3">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="E.g. 'From Nov 2018 to Dec 2020 I worked at Google as a software engineer. My tasks were...'"
                      autoFocus
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <LoadingButton
              variant="default"
              onClick={form.handleSubmit(onSubmit)}
              loading={form.formState.isSubmitting}
            >
              Generate
            </LoadingButton>
          </div>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default GenerateWorkExpBtn;
