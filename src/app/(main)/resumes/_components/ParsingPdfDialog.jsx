"use client"
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogContent,
} from "@/components/ui/dialog";
import { useResumeStore } from "@/stores/useResumeStore";
import React from "react";

const ParsingPdfDialog = () => {
  const { isUploadingResume, setIsUploadingResume } = useResumeStore();

  return (
    <Dialog open={isUploadingResume} onOpenChange={setIsUploadingResume}>
      <DialogContent className="w-full lg:max-w-2xl md:p-8 p-6 bg-gradient-to-br from-blue-50 via-white to-purple-50 border-0 shadow-2xl rounded-2xl overflow-hidden">
        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-32 h-32 bg-blue-500 rounded-full animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-24 h-24 bg-purple-500 rounded-full animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-indigo-500 rounded-full animate-pulse delay-500"></div>
        </div>

        <DialogHeader className="relative z-10">
          <DialogTitle className="text-3xl font-bold text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Parsing Your PDF
          </DialogTitle>
        </DialogHeader>

        <div className="relative z-10 text-center">
          <p className="text-gray-600 mt-3 mb-12 text-base md:text-lg font-medium">
            Please wait while we analyze your document...
          </p>

          {/* Main loading animation */}
          <div className="flex flex-col items-center justify-center mb-8">
            {/* Animated PDF icon with floating pages */}
            <div className="relative mb-6">
              {/* Main PDF container */}
              <div className="relative w-20 h-24 bg-gradient-to-b from-red-500 to-red-600 rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300">
                {/* PDF icon details */}
                <div className="absolute top-2 left-2 right-2 h-1 bg-white rounded opacity-80"></div>
                <div className="absolute top-5 left-2 right-4 h-1 bg-white rounded opacity-60"></div>
                <div className="absolute top-8 left-2 right-3 h-1 bg-white rounded opacity-40"></div>
                <div className="absolute bottom-3 left-2 right-2 text-white text-xs font-bold">
                  PDF
                </div>
              </div>

              {/* Floating animated pages */}
              <div className="absolute -top-2 -right-2 w-16 h-20 bg-gradient-to-b from-blue-400 to-blue-500 rounded-lg shadow-md animate-bounce delay-100 opacity-80"></div>
              <div className="absolute -top-4 -right-4 w-14 h-18 bg-gradient-to-b from-purple-400 to-purple-500 rounded-lg shadow-md animate-bounce delay-300 opacity-60"></div>
            </div>

            {/* Animated progress dots */}
            <div className="flex space-x-2 mb-6">
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"></div>
              <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce delay-100"></div>
              <div className="w-3 h-3 bg-indigo-500 rounded-full animate-bounce delay-200"></div>
              <div className="w-3 h-3 bg-pink-500 rounded-full animate-bounce delay-300"></div>
            </div>

            {/* Animated progress bar */}
            <div className="w-64 h-3 bg-gray-200 rounded-full overflow-hidden shadow-inner">
              <div className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full animate-pulse relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-ping opacity-75"></div>
                <div className="absolute top-0 left-0 h-full w-1/3 bg-white opacity-30 rounded-full animate-slide"></div>
              </div>
            </div>
          </div>

          {/* Processing steps with icons */}
          <div className="space-y-3 text-sm text-gray-500">
            <div className="flex items-center justify-center space-x-2 animate-pulse">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Extracting text content...</span>
            </div>
            <div className="flex items-center justify-center space-x-2 animate-pulse delay-500">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>Analyzing document structure...</span>
            </div>
            <div className="flex items-center justify-center space-x-2 animate-pulse delay-1000">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span>Finalizing results...</span>
            </div>
          </div>

          {/* Time estimate */}
          <div className="mt-8 px-4 py-2 bg-blue-50 rounded-lg border border-blue-100">
            <p className="text-blue-700 text-sm font-medium">
              ⏱️ This usually takes 30-60 seconds
            </p>
          </div>
        </div>

        {/* Custom CSS for additional animations */}
        <style jsx>{`
          @keyframes slide {
            0% {
              transform: translateX(-100%);
            }
            100% {
              transform: translateX(300%);
            }
          }

          .animate-slide {
            animation: slide 2s ease-in-out infinite;
          }
        `}</style>
      </DialogContent>
    </Dialog>
  );
};

export default ParsingPdfDialog;
