import React, { useState } from 'react';

const CreationPreview = ({ creation }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!creation) return null;

  const getTypeIcon = (type) => {
    const icons = {
      code: '🔧',
      api: '🌐',
      ui: '🎨',
      cli: '⚡'
    };
    return icons[type] || '📄';
  };

  const getTypeColor = (type) => {
    const colors = {
      code: 'bg-blue-100 text-blue-800',
      api: 'bg-green-100 text-green-800',
      ui: 'bg-purple-100 text-purple-800',
      cli: 'bg-orange-100 text-orange-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  const formatContent = (content, language) => {
    if (!content) return 'No content available';
    
    // Truncate content if it's too long and not expanded
    if (!isExpanded && content.length > 500) {
      return content.substring(0, 500) + '...';
    }
    
    return content;
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-white">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-lg">{getTypeIcon(creation.type)}</span>
          <h3 className="font-semibold text-gray-800">{creation.name}</h3>
          <span className={`px-2 py-1 text-xs rounded-full ${getTypeColor(creation.type)}`}>
            {creation.type.toUpperCase()}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {creation.executable && (
            <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
              EXECUTABLE
            </span>
          )}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-sm text-liquid-blue hover:text-blue-700"
          >
            {isExpanded ? 'Collapse' : 'Expand'}
          </button>
        </div>
      </div>
      
      <p className="text-gray-600 text-sm mb-3">{creation.description}</p>
      
      <div className="bg-gray-900 text-green-400 p-3 rounded-lg font-mono text-xs overflow-x-auto">
        <pre>{formatContent(creation.content, creation.language)}</pre>
      </div>
      
      <div className="flex items-center justify-between mt-3">
        <div className="flex items-center gap-4 text-xs text-gray-500">
          {creation.language && (
            <span>Language: {creation.language}</span>
          )}
          {creation.framework && (
            <span>Framework: {creation.framework}</span>
          )}
          <span>Created: {new Date(creation.timestamp).toLocaleString()}</span>
        </div>
        <div className="flex gap-2">
          <button className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded hover:bg-gray-200">
            Copy
          </button>
          <button className="text-xs bg-liquid-blue text-white px-2 py-1 rounded hover:bg-blue-700">
            Download
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreationPreview;