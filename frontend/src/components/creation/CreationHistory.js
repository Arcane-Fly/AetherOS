import React, { useState } from 'react';
import CreationLinker from './CreationLinker';
import CreationPreview from '../chat/CreationPreview';

const CreationHistory = ({ creations, setCreations }) => {
  const [selectedCreation, setSelectedCreation] = useState(null);
  const [showLinker, setShowLinker] = useState(false);

  const handleDeleteCreation = (id) => {
    setCreations(prev => prev.filter(creation => creation.id !== id));
  };

  const copyToClipboard = (code) => {
    navigator.clipboard.writeText(code);
    // You could add a toast notification here
  };

  const handleLink = (linkData) => {
    console.log('Creations linked:', linkData);
    // Update creation with links information
    setCreations(prev => prev.map(creation => {
      if (creation.id === linkData.sourceId) {
        return {
          ...creation,
          links: [...(creation.links || []), ...linkData.targetIds.map(id => ({
            targetId: id,
            type: linkData.linkType,
            timestamp: new Date()
          }))]
        };
      }
      return creation;
    }));
  };

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

  return (
    <div className="h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Creation History</h3>
        {creations.length > 0 && (
          <button
            onClick={() => setShowLinker(!showLinker)}
            className="text-sm bg-purple-100 text-purple-700 px-3 py-1 rounded-lg hover:bg-purple-200"
          >
            🔗 Link Mode
          </button>
        )}
      </div>
      
      {showLinker && creations.length > 0 && (
        <div className="mb-4">
          <CreationLinker
            creations={creations}
            onLink={handleLink}
            currentCreationId={selectedCreation}
          />
        </div>
      )}
      
      {creations.length === 0 ? (
        <div className="text-gray-500 text-sm">
          Your generated creations will appear here. Start by asking me to create something!
        </div>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {creations.map(creation => (
            <div 
              key={creation.id} 
              className={`bg-white rounded-lg p-4 border transition-all ${
                selectedCreation === creation.id ? 'border-purple-400 bg-purple-50' : 'border-gray-200'
              } ${showLinker ? 'cursor-pointer hover:border-purple-300' : ''}`}
              onClick={() => showLinker && setSelectedCreation(creation.id)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">{getTypeIcon(creation.type)}</span>
                    <h4 className="font-medium text-gray-800 text-sm">{creation.name}</h4>
                    <span className={`px-2 py-1 text-xs rounded-full ${getTypeColor(creation.type)}`}>
                      {creation.type.toUpperCase()}
                    </span>
                    {creation.executable && (
                      <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                        EXECUTABLE
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600 text-xs mb-2 line-clamp-2">{creation.description}</p>
                  
                  {creation.links && creation.links.length > 0 && (
                    <div className="mb-2">
                      <div className="text-xs text-purple-600 mb-1">
                        🔗 Linked to {creation.links.length} creation(s)
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {creation.links.map((link, index) => (
                          <span key={index} className="px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded">
                            {link.type}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center mt-2 space-x-2">
                    <span className="text-xs text-gray-500">
                      {new Date(creation.timestamp).toLocaleDateString()}
                    </span>
                    {creation.framework && (
                      <span className="text-xs text-gray-500">
                        • {creation.framework}
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="flex space-x-1 ml-2">
                  {creation.content && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        copyToClipboard(creation.content);
                      }}
                      className="text-gray-400 hover:text-gray-600 p-1"
                      title="Copy content"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </button>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteCreation(creation.id);
                    }}
                    className="text-gray-400 hover:text-red-600 p-1"
                    title="Delete creation"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
              
              {creation.content && (
                <details className="mt-3">
                  <summary className="text-xs text-liquid-blue cursor-pointer hover:text-blue-700 flex items-center gap-1">
                    <span>View Content</span>
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <div className="mt-2 bg-gray-900 text-green-400 p-3 rounded-lg text-xs font-mono overflow-x-auto">
                    <pre>{creation.content}</pre>
                  </div>
                </details>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CreationHistory;