import React from 'react';
import { CheckCircle } from 'lucide-react';
import Link from 'next/link';

const BenefitsSection = () => {
  const benefits = [
    {
      title: 'No More Writer\'s Block',
      description: 'Let AI generate perfect content for your experience, skills, and achievements.',
    },
    {
      title: 'Built-in Expert Tips',
      description: 'Get real-time suggestions from hiring experts as you build your resume.',
    },
    {
      title: 'Better Chances of Getting Interviews',
      description: 'Our ATS-optimized resumes increase your interview chances by up to 70%.',
    },
    {
      title: 'Save Hours of Time',
      description: 'Create a professional resume in minutes instead of hours or days.',
    },
  ];
  
  return (
    <section className="py-20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col lg:flex-row items-center">
          <div className="lg:w-1/2 mb-12 lg:mb-0 lg:pr-12">
            <img 
              src="https://images.pexels.com/photos/6393013/pexels-photo-6393013.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
              alt="Happy job seeker" 
              className="rounded-xl shadow-xl max-w-full"
            />
          </div>
          <div className="lg:w-1/2">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Why Choose Our AI Resume Builder?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Get the competitive edge in your job search with our powerful AI tools.
            </p>
            
            <div className="space-y-6">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex">
                  <CheckCircle className="text-green-500 mr-4 flex-shrink-0 mt-1" size={24} />
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                      {benefit.title}
                    </h3>
                    <p className="text-gray-600">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <Link href="/resumes" legacyBehavior>
              <a className="mt-10 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full font-medium text-lg transition-all transform hover:scale-105 inline-block">
                Try It Now
              </a>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;