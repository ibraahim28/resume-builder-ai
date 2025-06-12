"use client";
import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import Link from "next/link";

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200 py-4">
      <button
        className="flex justify-between items-center w-full text-left font-medium text-lg text-gray-800 py-2"
        onClick={() => setIsOpen(!isOpen)}
      >
        {question}
        {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </button>

      {isOpen && <div className="mt-2 text-gray-600 pb-2">{answer}</div>}
    </div>
  );
};

const FAQSection = () => {
  const faqs = [
    {
      question: "Is Resumee really free to use?",
      answer:
        "Yes, you can create your first resume for free. We offer premium plans with additional features like unlimited resumes, AI tools, and advanced customization tools.",
    },
    {
      question: "How does the AI analyze my resume?",
      answer:
        "Our AI analyzes your experience, skills, and education to based on ATS-optimized filters. It uses industry best practices and hiring trends to highlight your strengths and give you tips to improve your resume.",
    },
    {
      question: "Can I customize my resume's contents after the AI generates it?",
      answer:
        "Absolutely! You have full control to edit, rearrange, and customize any part of your resume after the AI generates the initial content.",
    },
    {
      question: "What format can I download my resume in?",
      answer:
        "You can download your resume as a PDF file, which is the industry standard for job applications. And you can also print them on a paper.",
    },
    {
      question: "Will my resume pass ATS systems?",
      answer:
        "Yes, our resume builder is designed to be ATS-friendly, and our AI optimizes your content with relevant keywords for your target role to help you pass ATS screening.",
    },
    {
      question: "Is my data secure?",
      answer:
        "We take data security seriously. Your information is encrypted and never shared with third parties. You can delete your account and all associated data at any time.",
    },
  ];

  return (
    <section id="faq" className="py-20">
      <div className="container mx-auto px-4 md:px-6 max-w-4xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-gray-600">
            Everything you need to know about our AI resume builder
          </p>
        </div>

        <div className="space-y-2">
          {faqs.map((faq, index) => (
            <FAQItem key={index} question={faq.question} answer={faq.answer} />
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-6">Still have questions?</p>
          <Link href="/contact" legacyBehavior>
            <a className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-8 py-3 rounded-full font-medium transition-all">
              Contact Support
            </a>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
