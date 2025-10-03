import React, { useState } from 'react';
import { creationService } from '../../services/api';

const CreationLinker = ({ creations, onLink, currentCreationId = null }) => {
  const [selectedCreations, setSelectedCreations] = useState([]);
  const [linkType, setLinkType] = useState('reference');
  const [searchTerm, setSearchTerm] = useState('');
  const [isVisible, setIsVisible] = useState(false);

  const linkTypes = [
    { value: 'reference', label: 'Reference', description: 'Use as reference or import' },
    { value: 'extends', label: 'Extends', description: 'Build upon this creation' },
    { value: 'imports', label: 'Imports', description: 'Import functions/components' },
    { value: 'dependency', label: 'Dependency', description: 'Required for execution' },
  ];

  const filteredCreations = creations.filter((creation) => {
    if (currentCreationId && creation.id === currentCreationId) return false;
    if (!searchTerm) return true;

    return (
      creation.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      creation.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      creation.type.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const handleCreationToggle = (creationId) => {
    setSelectedCreations((prev) =>
      prev.includes(creationId) ? prev.filter((id) => id !== creationId) : [...prev, creationId]
    );
  };

  const handleLink = async () => {
    if (!currentCreationId || selectedCreations.length === 0) return;

    try {
      for (const targetId of selectedCreations) {
        await creationService.linkCreations(currentCreationId, targetId, linkType);
      }

      onLink &&
        onLink({
          sourceId: currentCreationId,
          targetIds: selectedCreations,
          linkType,
        });

      setSelectedCreations([]);
      setIsVisible(false);
    } catch (error) {
      console.error('Failed to link creations:', error);
    }
  };

  const getTypeIcon = (type) => {
    const icons = {
      code: '🔧',
      api: '🌐',
      ui: '🎨',
      cli: '⚡',
    };
    return icons[type] || '📄';
  };

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="flex items-center gap-2 px-3 py-2 text-sm bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200"
      >
        🔗 Link Creations
      </button>
    );
  }

  return (
    <div className="border border-purple-200 bg-purple-50 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-purple-800">Link to Existing Creations</h3>
        <button
          onClick={() => setIsVisible(false)}
          className="text-purple-600 hover:text-purple-800"
        >
          ✕
        </button>
      </div>

      <div className="space-y-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search creations..."
            className="flex-1 px-3 py-2 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <select
            value={linkType}
            onChange={(e) => setLinkType(e.target.value)}
            className="px-3 py-2 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            {linkTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        <div className="max-h-64 overflow-y-auto space-y-2">
          {filteredCreations.map((creation) => (
            <div
              key={creation.id}
              className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                selectedCreations.includes(creation.id)
                  ? 'border-purple-400 bg-purple-100'
                  : 'border-gray-200 bg-white hover:border-purple-300'
              }`}
              onClick={() => handleCreationToggle(creation.id)}
            >
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectedCreations.includes(creation.id)}
                  onChange={() => handleCreationToggle(creation.id)}
                  className="text-purple-600"
                />
                <span className="text-lg">{getTypeIcon(creation.type)}</span>
                <div className="flex-1">
                  <div className="font-medium">{creation.name}</div>
                  <div className="text-sm text-gray-600">{creation.description}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {creation.type} • {new Date(creation.timestamp).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {filteredCreations.length === 0 && (
            <div className="text-center text-gray-500 py-8">
              {searchTerm ? 'No creations match your search' : 'No creations available to link'}
            </div>
          )}
        </div>

        {selectedCreations.length > 0 && (
          <div className="flex items-center justify-between">
            <div className="text-sm text-purple-700">
              {selectedCreations.length} creation(s) selected
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedCreations([])}
                className="px-3 py-2 text-sm border border-purple-200 text-purple-700 rounded-lg hover:bg-purple-100"
              >
                Clear
              </button>
              <button
                onClick={handleLink}
                className="px-3 py-2 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                Link {selectedCreations.length} Creation(s)
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreationLinker;
