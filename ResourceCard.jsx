// src/components/Dashboard/ResourceCard.jsx
import React from 'react';
import { Download, Play, Eye, BookOpen } from 'lucide-react';

const ResourceCard = ({ resource }) => {
  const getResourceIcon = () => {
    switch (resource.type) {
      case 'pdf':
        return <BookOpen className="w-5 h-5 text-red-400" />;
      case 'video':
        return <Play className="w-5 h-5 text-blue-400" />;
      case 'zip':
        return <Download className="w-5 h-5 text-green-400" />;
      default:
        return <Eye className="w-5 h-5 text-gray-400" />;
    }
  };

  const getResourceInfo = () => {
    if (resource.size) return `Size: ${resource.size}`;
    if (resource.duration) return `Duration: ${resource.duration}`;
    return '';
  };

  return (
    <div className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg hover:bg-gray-800/50 transition-colors">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-gray-800 rounded-lg">
          {getResourceIcon()}
        </div>
        <div>
          <div className="font-medium text-white">{resource.title}</div>
          <div className="text-xs text-gray-400">{getResourceInfo()}</div>
        </div>
      </div>
      <button className="p-2 hover:bg-gray-700 rounded-lg transition-colors">
        <Download className="w-4 h-4 text-gray-400" />
      </button>
    </div>
  );
};

export default ResourceCard;
