import React from 'react';
import { Star } from 'lucide-react';
import Link from 'next/link';

const TestimonialsSection = () => {
  const testimonials = [
    {
      name: 'Sarah Johnson',
      position: 'Marketing Specialist',
      photo: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=600',
      quote: 'I was struggling to update my resume for months. With resumee, I created a professional resume in 20 minutes and landed interviews at 3 top companies within a week!',
      rating: 5,
    },
    {
      name: 'Michael Chen',
      position: 'Software Engineer',
      photo: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=600',
      quote: 'The AI generated perfect descriptions of my technical skills and projects. My resume now stands out while being ATS-friendly. Already got 2 interview calls!',
      rating: 5,
    },
    {
      name: 'Jessica Williams',
      position: 'Project Manager',
      photo: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=600',
      quote: 'After 6 months of job searching with no luck, I tried resumee. Within 2 weeks of sending out my new resume, I received multiple interview requests and a job offer!',
      rating: 5,
    },
  ];
  
  return (
    <section id="testimonials" className="py-20 bg-blue-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Success Stories
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Join thousands of job seekers who found success with our AI resume builder
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index} 
              className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow relative"
            >
              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                <img 
                  src={testimonial.photo} 
                  alt={testimonial.name} 
                  className="w-16 h-16 rounded-full border-4 border-white shadow"
                />
              </div>
              
              <div className="flex justify-center mt-6 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} size={20} className="text-yellow-400 fill-current" />
                ))}
              </div>
              
              <p className="text-gray-600 italic mb-6 text-center">
                "{testimonial.quote}"
              </p>
              
              <div className="text-center">
                <h4 className="font-bold text-gray-800">
                  {testimonial.name}
                </h4>
                <p className="text-gray-500 text-sm">
                  {testimonial.position}
                </p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <p className="text-2xl font-bold text-gray-800 mb-8">
            Join 10,000+ professionals who improved their job prospects
          </p>
          <Link href="/resumes" legacyBehavior>
            <a className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full font-medium text-lg transition-all transform hover:scale-105">
              Create My Resume Now
            </a>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;