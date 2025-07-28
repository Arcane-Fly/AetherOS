import React, { useState, useEffect } from 'react';
import { creationService } from '../../services/api';

const TemplateBrowser = ({ onTemplateSelect, onClose }) => {
  const [templates, setTemplates] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  useEffect(() => {
    loadTemplates();
  }, [typeFilter, searchTerm]);

  const loadTemplates = async () => {
    try {
      setLoading(true);
      const filters = {};
      if (typeFilter) filters.type = typeFilter;
      if (searchTerm) filters.search = searchTerm;

      const response = await creationService.getTemplates(filters);
      setTemplates(response.categories || {});
      
      // Set default category if none selected
      if (!selectedCategory && Object.keys(response.categories).length > 0) {
        setSelectedCategory(Object.keys(response.categories)[0]);
      }
    } catch (err) {
      setError('Failed to load templates. Please try again.');
      console.error('Error loading templates:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateFromTemplate = async (template, customName = '') => {
    try {
      const options = {};
      if (customName) {
        options.name = customName;
      }

      const response = await creationService.createFromTemplate(template.id, options);
      
      if (response.success) {
        alert(`Creation "${response.creation.name}" created successfully from template!`);
        if (onTemplateSelect) {
          onTemplateSelect(response.creation, template);
        }
        onClose();
      }
    } catch (error) {
      console.error('Error creating from template:', error);
      alert('Failed to create from template. Please try again.');
    }
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

  const getDifficultyColor = (difficulty) => {
    const colors = {
      beginner: 'bg-green-100 text-green-700',
      intermediate: 'bg-yellow-100 text-yellow-700',
      advanced: 'bg-red-100 text-red-700'
    };
    return colors[difficulty] || 'bg-gray-100 text-gray-700';
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading templates...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md">
          <div className="text-center">
            <div className="text-red-500 mb-2">❌</div>
            <p className="text-red-600 mb-4">{error}</p>
            <div className="flex gap-2 justify-center">
              <button
                onClick={loadTemplates}
                className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
              >
                Retry
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const categories = Object.keys(templates);
  const selectedTemplates = selectedCategory ? templates[selectedCategory] || [] : [];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-6xl h-5/6 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-800">Template Browser</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>

        {/* Search and Filters */}
        <div className="p-6 border-b bg-gray-50">
          <div className="flex gap-4 mb-4">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search templates..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">All Types</option>
              <option value="code">🔧 Code</option>
              <option value="api">🌐 API</option>
              <option value="ui">🎨 UI</option>
              <option value="cli">⚡ CLI</option>
            </select>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Categories Sidebar */}
          <div className="w-64 bg-gray-50 border-r overflow-y-auto">
            <div className="p-4">
              <h3 className="font-medium text-gray-700 mb-3">Categories</h3>
              <div className="space-y-1">
                {categories.map(category => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`w-full text-left px-3 py-2 rounded text-sm ${
                      selectedCategory === category
                        ? 'bg-purple-100 text-purple-700 font-medium'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {category}
                    <span className="float-right text-xs text-gray-500">
                      {templates[category]?.length || 0}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Templates Grid */}
          <div className="flex-1 overflow-y-auto p-6">
            {selectedTemplates.length === 0 ? (
              <div className="text-center text-gray-500 py-12">
                <div className="text-4xl mb-4">📄</div>
                <p>No templates found in this category.</p>
                {searchTerm && (
                  <p className="text-sm mt-2">Try adjusting your search or filters.</p>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {selectedTemplates.map(template => (
                  <div key={template.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{getTypeIcon(template.type)}</span>
                        <h4 className="font-medium text-gray-800 text-sm">{template.name}</h4>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full ${getTypeColor(template.type)}`}>
                        {template.type.toUpperCase()}
                      </span>
                    </div>

                    <p className="text-gray-600 text-sm mb-3 line-clamp-3">{template.description}</p>

                    {template.metadata && (
                      <div className="mb-3">
                        {template.metadata.difficulty && (
                          <span className={`inline-block px-2 py-1 text-xs rounded-full mr-2 ${getDifficultyColor(template.metadata.difficulty)}`}>
                            {template.metadata.difficulty}
                          </span>
                        )}
                        {template.metadata.estimated_time && (
                          <span className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full">
                            ⏱️ {template.metadata.estimated_time}
                          </span>
                        )}
                      </div>
                    )}

                    {template.framework && (
                      <div className="text-xs text-gray-500 mb-3">
                        Framework: {template.framework}
                      </div>
                    )}

                    <button
                      onClick={() => handleCreateFromTemplate(template)}
                      className="w-full bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700 transition-colors text-sm"
                    >
                      Use This Template
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateBrowser;