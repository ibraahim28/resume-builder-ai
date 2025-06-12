import React from 'react';

const TrustedBySection = () => {
  // Mock company names
  const companies = ['Google', 'Amazon', 'Meta', 'Microsoft', 'Apple'];
  
  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center">
          <p className="text-gray-500 uppercase tracking-wide font-medium text-sm mb-6">
            Trusted by job seekers from top companies
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
            {companies.map((company, index) => (
              <div key={index} className="text-gray-400 font-bold text-xl md:text-2xl">
                {company}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustedBySection;