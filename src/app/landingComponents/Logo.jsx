import React from 'react';
import { FileText } from 'lucide-react';

const Logo = () => {
  return (
    <div className="flex items-center">
      <FileText className="text-blue-600 mr-2" size={28} />
      <span className="text-xl font-bold text-gray-800">Resumee</span>
    </div>
  );
};

export default Logo;