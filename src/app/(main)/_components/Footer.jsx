import React from 'react';
import Link from 'next/link';

const Footer = () => {
  return (

    <footer className="bg-blue-950 py-6 border-t">
      <div className="container mx-auto px-4 max-w-7xl ">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-sm text-white">© 2024 GenResume. All rights reserved.</p>
            <p className="text-xs text-gray-400 mt-1">Powered by AI, designed for you</p>
          </div>
          <div className="flex gap-6">
            <Link href="/" className="text-sm text-white hover:text-blue-600 transition-colors">
              Home
            </Link>
            <Link href="/about" className="text-sm text-white hover:text-blue-600 transition-colors">
              About
            </Link>
            <Link href="/privacy" className="text-sm text-white hover:text-blue-600 transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="text-sm text-white hover:text-blue-600 transition-colors">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;