import React from "react";
import Link from "next/link";

const HeroSection = () => {
  return (
    <section className="pt-32 pb-20 min-h-screen flex items-center">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col lg:flex-row items-center justify-center min-h-[60vh]">
          <div className="lg:w-1/2 mb-12 lg:mb-0 mr-6">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-6">
              Build Job-Winning Resumes Instantly with AI
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-lg">
              Generate ATS-optimized, professional resumes in seconds. No design
              skills needed.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/resumes" legacyBehavior>
                <a className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full font-medium text-lg transition-all transform hover:scale-105">
                  Generate My Resume
                </a>
              </Link>
              <a href="#how-it-works" className="border border-gray-300 hover:border-blue-600 hover:text-blue-600 px-8 py-3 rounded-full font-medium text-lg transition-all">
                Learn More
              </a>
            </div>
            <p className="mt-6 text-sm text-gray-500">
              🔒 No credit card required • Free to get started
            </p>
          </div>
          <div className="lg:w-1/2">
            <div className="relative">
              <div className="absolute -top-10 -left-10 w-full h-full bg-blue-200 rounded-xl transform rotate-3"></div>
              <img
                src="https://images.pexels.com/photos/5699469/pexels-photo-5699469.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                alt="Resume Generator Preview"
                className="relative z-10 rounded-xl shadow-xl"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
