import LoadingButton from "@/components/LoadingButton";
import { Button } from "@/components/ui/button";
import { generateProjectEntrySchema } from "@/lib/formValidations";
import { WandSparklesIcon } from "lucide-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { generateProjectEntry } from "../../../_actions/generateProjectEntryAction";
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

const GenerateProjectBtn = ({ onProjectGenerated }) => {
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
        onProjectGenerated={(project) => {
          onProjectGenerated(project);
          setShowInputDialog(false);
        }}
      />
    </>
  );
};

function InputDialog({ open, onOpenChange, onProjectGenerated }) {
  const form = useForm({
    resolver: zodResolver(generateProjectEntrySchema),
    defaultValues: {
      description: "",
    },
  });

  async function onSubmit(input) {
    try {
      const response = await generateProjectEntry(input);
      onProjectGenerated(response);
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong. Please try again");
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Generate project entry</DialogTitle>
          <DialogDescription>
            Describe your project briefly and the AI will fill the form for you.
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
                      placeholder="E.g. 'Built an e commerce store with admin dashboard and auth using react tailwind and firebase...'"
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
              {form.formState.isSubmitting ? "Generating" : "Generate"}
            </LoadingButton>
          </div>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default GenerateProjectBtn;
