import React from 'react';
import { 
  PenTool, 
  CheckCircle, 
  Layout, 
  FileDown, 
  Eye, 
  Clock
} from 'lucide-react';

const FeaturesSection = () => {
  const features = [
    {
      icon: <PenTool size={32} className="text-blue-600" />,
      title: 'AI Resume Writing',
      description: 'Our AI writes compelling, professional content tailored to your industry and role.',
    },
    {
      icon: <CheckCircle size={32} className="text-blue-600" />,
      title: 'ATS Optimization',
      description: 'Designed to pass Applicant Tracking Systems with the right keywords for your target role.',
    },
    {
      icon: <Layout size={32} className="text-blue-600" />,
      title: 'Multiple Templates',
      description: 'Choose from dozens of professionally designed templates for any industry.',
    },
    {
      icon: <FileDown size={32} className="text-blue-600" />,
      title: 'Instant PDF Download',
      description: 'Download your resume in PDF format, ready to send to employers.',
    },
    {
      icon: <Eye size={32} className="text-blue-600" />,
      title: 'Real-time Preview',
      description: 'See changes to your resume in real-time as you make edits.',
    },
    {
      icon: <Clock size={32} className="text-blue-600" />,
      title: 'Create in Minutes',
      description: 'Save hours of work and create a professional resume in just minutes.',
    },
  ];
  
  return (
    <section id="features" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Powerful Features
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Everything you need to create a standout resume
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="bg-white rounded-xl p-8 shadow hover:shadow-lg transition-shadow border border-gray-100"
            >
              <div className="bg-blue-50 rounded-full w-16 h-16 flex items-center justify-center mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;