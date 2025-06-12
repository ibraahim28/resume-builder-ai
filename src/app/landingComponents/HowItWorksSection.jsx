import React from 'react';
import { FileEdit, Sparkles as WandSparkles, Download } from 'lucide-react';

const HowItWorksSection = () => {
  const steps = [
    {
      icon: <FileEdit size={32} className="text-blue-600" />,
      title: 'Enter Your Information',
      description: 'Upload your existing resume or enter your experience, skills, and education.',
    },
    {
      icon: <WandSparkles size={32} className="text-blue-600" />,
      title: 'Let AI Do the Magic',
      description: 'Our AI will craft the perfect professional resume optimized for ATS systems.',
    },
    {
      icon: <Download size={32} className="text-blue-600" />,
      title: 'Download & Share',
      description: 'Download your resume in PDF format, or share it directly with employers.',
    },
  ];
  
  return (
    <section id="how-it-works" className="py-20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Create a professional resume in three simple steps
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-blue-50 rounded-full w-16 h-16 flex items-center justify-center mb-6 mx-auto">
                {step.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">
                {step.title}
              </h3>
              <p className="text-gray-600 text-center">
                {step.description}
              </p>
              <div className="mt-6 flex justify-center">
                <span className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">
                  {index + 1}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;