import React from "react";

const CTASection = () => {
  return (
    <section className="relative py-20 overflow-hidden">
      {/* Main blue gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-blue-400 to-blue-300"></div>
      
      {/* Circular decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-gradient-to-br from-blue-300/30 to-transparent"></div>
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-gradient-to-br from-blue-200/20 to-transparent"></div>
        <div className="absolute -bottom-32 -right-32 w-72 h-72 rounded-full bg-gradient-to-tl from-blue-600/20 to-transparent"></div>
        <div className="absolute top-1/2 -right-48 w-64 h-64 rounded-full bg-gradient-to-l from-white/10 to-transparent"></div>
      </div>

      {/* Content */}
      <div className="relative container mx-auto px-6 max-w-4xl">
        <div className="text-white">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
            Start Building Your Resume for Free
          </h2>
          <p className="text-lg md:text-xl mb-10 opacity-90 max-w-2xl">
            Ready to land your dream job with a professional resume? 
            Join thousands who've already improved their hiring chances.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 items-start">
            <button className="bg-black text-white px-8 py-4 rounded-full font-semibold text-lg shadow-lg hover:bg-gray-800 transition-all duration-300 hover:scale-105 active:scale-95 flex items-center gap-2">
              Import your resume
              <div className="w-2 h-2 rounded-full bg-white"></div>
            </button>
            
            <button 
              className="text-white px-8 py-4 rounded-full font-semibold text-lg border-2 border-white/30 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 hover:scale-105 active:scale-95 flex items-center gap-2"
              style={{ 
                background: 'linear-gradient(135deg, oklch(54.6% 0.245 262.881), oklch(60% 0.2 262.881))',
                borderColor: 'oklch(54.6% 0.245 262.881)'
              }}
            >
              Create New
              <div className="w-2 h-2 rounded-full bg-white/80"></div>
            </button>
          </div>

          {/* Trust indicator */}
          <p className="mt-8 text-sm opacity-75 tracking-wide">
            🔒 No credit card required • 👤 No Login Required
          </p>
        </div>
      </div>

      {/* Bottom subtle shadow */}
      <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-black/5 to-transparent"></div>
    </section>
  );
};

export default CTASection;