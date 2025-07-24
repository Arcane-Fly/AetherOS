import React from 'react';

const CreationHistory = ({ creations, setCreations }) => {
  const handleDeleteCreation = (id) => {
    setCreations(prev => prev.filter(creation => creation.id !== id));
  };

  const copyToClipboard = (code) => {
    navigator.clipboard.writeText(code);
    // You could add a toast notification here
  };

  return (
    <div className="h-full">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Creation History</h3>
      
      {creations.length === 0 ? (
        <div className="text-gray-500 text-sm">
          Your generated creations will appear here. Start by asking me to create something!
        </div>
      ) : (
        <div className="space-y-3">
          {creations.map(creation => (
            <div key={creation.id} className="bg-gray-50 rounded-lg p-3 border">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-800 text-sm">{creation.name}</h4>
                  <p className="text-gray-600 text-xs mt-1 line-clamp-2">{creation.description}</p>
                  <div className="flex items-center mt-2 space-x-2">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-liquid-blue bg-opacity-10 text-liquid-blue">
                      {creation.language || creation.type}
                    </span>
                    <span className="text-xs text-gray-500">
                      {creation.timestamp.toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="flex space-x-1 ml-2">
                  {creation.content && (
                    <button
                      onClick={() => copyToClipboard(creation.content)}
                      className="text-gray-400 hover:text-gray-600 p-1"
                      title="Copy code"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </button>
                  )}
                  <button
                    onClick={() => handleDeleteCreation(creation.id)}
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
                <details className="mt-2">
                  <summary className="text-xs text-liquid-blue cursor-pointer hover:text-blue-700">
                    View Code
                  </summary>
                  <div className="mt-2 bg-gray-900 text-green-400 p-2 rounded text-xs font-mono overflow-x-auto">
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