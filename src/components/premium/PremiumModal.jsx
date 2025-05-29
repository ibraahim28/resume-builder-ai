import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { CheckCircle2 } from "lucide-react";

const PremiumModal = () => {
  const features = {
    basic: [
      "Create & download 1 resume",
      "Access all AI tools",
      "Full design customization",
      "Resume editable anytime",
    ],
    lifetime: [
      "Unlimited resumes & downloads",
      "All AI tools & design options",
      "Unlimited edits",
      "Priority support",
      "Early access to new features",
    ],
  };

  const FeatureList = ({ items }) => (
    <ul className="space-y-2 text-sm text-gray-600">
      {items.map((item, i) => (
        <li key={i} className="flex items-center gap-2 leading-snug">
          <CheckCircle2 className="text-green-600 w-4 h-4 shrink-0" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );

  return (
    <Dialog open>
      <DialogContent className="w-full overflow-y-auto max-h-[95vh] lg:max-w-2xl md:p-6 p-4">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            Unlock GenResume Premium
          </DialogTitle>
        </DialogHeader>

        <p className="text-center text-gray-500 mt-2 mb-8 text-sm md:text-base">
          Choose a one-time plan that fits your job-seeking needs.
        </p>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Basic Plan */}
          <div className="flex flex-col justify-between rounded-xl border p-6 shadow-sm bg-white">
            <div>
              <h3 className="text-lg font-semibold text-center">
                1-Resume Plan
              </h3>
              <p className="text-center text-3xl font-bold text-blue-600 my-2">
                $4.99
              </p>
              <FeatureList items={features.basic} />
            </div>
            <Button className="mt-6 w-full text-white bg-blue-600 hover:bg-blue-700 transition">
              Get Started
            </Button>
          </div>

          {/* Lifetime Plan */}
          <div className="relative overflow-hidden flex flex-col justify-between rounded-xl border-2 border-blue-600 p-6 bg-blue-50 shadow-sm">
            <span className="absolute top-0 right-0 rounded-bl-lg bg-yellow-400 text-xs font-semibold px-2 py-0.5 shadow">
              BEST VALUE
            </span>
            <div>
              <h3 className="text-lg font-semibold text-center">
                Unlimited Resumes
              </h3>
              <p className="text-center text-3xl font-bold text-blue-600 my-2">
                $39.00
              </p>
              <FeatureList items={features.lifetime} />
            </div>
            <Button className="mt-6 w-full bg-blue-600 text-white hover:bg-blue-700 transition">
              Unlock Lifetime Access
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PremiumModal;
