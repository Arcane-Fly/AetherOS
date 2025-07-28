import React, { useState, useEffect } from 'react';
import CreationLinker from './CreationLinker';
import CreationPreview from '../chat/CreationPreview';
import { creationService } from '../../services/api';

const CreationHistory = ({ creations, setCreations }) => {
  const [selectedCreation, setSelectedCreation] = useState(null);
  const [showLinker, setShowLinker] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('DESC');
  const [filteredCreations, setFilteredCreations] = useState(creations);
  const [selectedForExport, setSelectedForExport] = useState([]);
  const [showExportOptions, setShowExportOptions] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);

  // Filter and sort creations based on current filters
  useEffect(() => {
    let filtered = [...creations];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(creation =>
        creation.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        creation.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (creation.content && creation.content.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Apply type filter
    if (typeFilter) {
      filtered = filtered.filter(creation => creation.type === typeFilter);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue, bValue;
      switch (sortBy) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'type':
          aValue = a.type;
          bValue = b.type;
          break;
        case 'updated_at':
          aValue = new Date(a.updated_at || a.timestamp);
          bValue = new Date(b.updated_at || b.timestamp);
          break;
        default: // created_at
          aValue = new Date(a.created_at || a.timestamp);
          bValue = new Date(b.created_at || b.timestamp);
      }

      if (sortOrder === 'ASC') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredCreations(filtered);
  }, [creations, searchTerm, typeFilter, sortBy, sortOrder]);

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

  const clearFilters = () => {
    setSearchTerm('');
    setTypeFilter('');
    setSortBy('created_at');
    setSortOrder('DESC');
  };

  const handleExportSingle = async (creation) => {
    try {
      const blob = await creationService.exportCreation(creation.id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${creation.name}-export.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
    }
  };

  const handleExportMultiple = async () => {
    try {
      const ids = selectedForExport.length > 0 ? selectedForExport : null;
      const blob = await creationService.exportMultipleCreations(ids);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = ids ? `${ids.length}-creations-export.json` : 'all-creations-export.json';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      setSelectedForExport([]);
      setShowExportOptions(false);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
    }
  };

  const handleImport = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      const text = await file.text();
      const importData = JSON.parse(text);
      
      const result = await creationService.importCreations(importData, {
        overwriteExisting: false,
        preserveLinks: true
      });

      if (result.success) {
        alert(`Import completed!\nImported: ${result.summary.imported}\nSkipped: ${result.summary.skipped}\nErrors: ${result.summary.errors}`);
        
        // Refresh creations list
        window.location.reload(); // Simple refresh for now
      }
    } catch (error) {
      console.error('Import failed:', error);
      alert('Import failed. Please check the file format and try again.');
    }
    
    // Reset file input
    event.target.value = '';
    setShowImportDialog(false);
  };

  const toggleExportSelection = (creationId) => {
    setSelectedForExport(prev => 
      prev.includes(creationId)
        ? prev.filter(id => id !== creationId)
        : [...prev, creationId]
    );
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

  const hasActiveFilters = searchTerm || typeFilter || sortBy !== 'created_at' || sortOrder !== 'DESC';

  return (
    <div className="h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Creation History</h3>
        <div className="flex gap-2">
          {creations.length > 0 && (
            <>
              <button
                onClick={() => setShowExportOptions(!showExportOptions)}
                className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-lg hover:bg-blue-200"
                title="Export creations"
              >
                📥 Export
              </button>
              <button
                onClick={() => setShowImportDialog(true)}
                className="text-sm bg-green-100 text-green-700 px-3 py-1 rounded-lg hover:bg-green-200"
                title="Import creations"
              >
                📤 Import
              </button>
              <button
                onClick={() => setShowLinker(!showLinker)}
                className="text-sm bg-purple-100 text-purple-700 px-3 py-1 rounded-lg hover:bg-purple-200"
              >
                🔗 Link Mode
              </button>
            </>
          )}
          {creations.length === 0 && (
            <button
              onClick={() => setShowImportDialog(true)}
              className="text-sm bg-green-100 text-green-700 px-3 py-1 rounded-lg hover:bg-green-200"
              title="Import creations"
            >
              📤 Import
            </button>
          )}
        </div>
      </div>

      {/* Import Dialog */}
      {showImportDialog && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium text-green-800">Import Creations</h4>
            <button
              onClick={() => setShowImportDialog(false)}
              className="text-green-600 hover:text-green-800"
            >
              ✕
            </button>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-green-700">
              Select a JSON file exported from AetherOS to import creations.
            </p>
            <input
              type="file"
              accept=".json"
              onChange={handleImport}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-green-100 file:text-green-700 hover:file:bg-green-200"
            />
          </div>
        </div>
      )}

      {/* Export Options */}
      {showExportOptions && (
        <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium text-blue-800">Export Options</h4>
            <button
              onClick={() => setShowExportOptions(false)}
              className="text-blue-600 hover:text-blue-800"
            >
              ✕
            </button>
          </div>
          <div className="space-y-3">
            <div className="flex gap-2">
              <button
                onClick={handleExportMultiple}
                className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
              >
                Export All Creations
              </button>
              {selectedForExport.length > 0 && (
                <button
                  onClick={handleExportMultiple}
                  className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                >
                  Export Selected ({selectedForExport.length})
                </button>
              )}
            </div>
            <p className="text-sm text-blue-700">
              Select individual creations below and click their export button, or use selection mode to export multiple at once.
            </p>
            {selectedForExport.length === 0 && (
              <p className="text-sm text-blue-600">
                💡 Click the checkboxes next to creations to select them for batch export.
              </p>
            )}
          </div>
        </div>
      )}

      {/* Search and Filter Controls */}
      {creations.length > 0 && (
        <div className="mb-4 space-y-3">
          {/* Search Bar */}
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search creations by name, description, or content..."
              className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <svg className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          {/* Filter Controls */}
          <div className="flex flex-wrap gap-2 items-center">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">All Types</option>
              <option value="code">🔧 Code</option>
              <option value="api">🌐 API</option>
              <option value="ui">🎨 UI</option>
              <option value="cli">⚡ CLI</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="created_at">Sort by Created</option>
              <option value="updated_at">Sort by Modified</option>
              <option value="name">Sort by Name</option>
              <option value="type">Sort by Type</option>
            </select>

            <button
              onClick={() => setSortOrder(sortOrder === 'ASC' ? 'DESC' : 'ASC')}
              className="px-3 py-1 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500"
              title={`Sort ${sortOrder === 'ASC' ? 'Descending' : 'Ascending'}`}
            >
              {sortOrder === 'ASC' ? '↑' : '↓'}
            </button>

            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="px-3 py-1 text-sm text-red-600 hover:text-red-800 border border-red-200 rounded-lg hover:bg-red-50"
              >
                Clear Filters
              </button>
            )}

            <div className="text-sm text-gray-500">
              {filteredCreations.length} of {creations.length} creations
            </div>
          </div>
        </div>
      )}
      
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
      ) : filteredCreations.length === 0 ? (
        <div className="text-gray-500 text-sm text-center py-8">
          No creations match your current filters.
          <button
            onClick={clearFilters}
            className="ml-2 text-purple-600 hover:text-purple-800 underline"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {filteredCreations.map(creation => (
            <div 
              key={creation.id} 
              className={`bg-white rounded-lg p-4 border transition-all ${
                selectedCreation === creation.id ? 'border-purple-400 bg-purple-50' : 'border-gray-200'
              } ${showLinker ? 'cursor-pointer hover:border-purple-300' : ''}`}
              onClick={() => showLinker && setSelectedCreation(creation.id)}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2 flex-1">
                  {(showExportOptions || selectedForExport.length > 0) && (
                    <input
                      type="checkbox"
                      checked={selectedForExport.includes(creation.id)}
                      onChange={() => toggleExportSelection(creation.id)}
                      className="text-blue-600"
                      onClick={(e) => e.stopPropagation()}
                    />
                  )}
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
                </div>
                
                <div className="flex space-x-1 ml-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleExportSingle(creation);
                    }}
                    className="text-gray-400 hover:text-blue-600 p-1"
                    title="Export this creation"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </button>
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