import React, { useState, useEffect } from 'react';
import CreationLinker from './CreationLinker';
import TemplateBrowser from './TemplateBrowser';
import { creationService } from '../../services/api';
import { GlassPanel, GlassButton, GlassInput } from '../ui/GlassPanel';
import type { CreationHistoryProps } from '../../types/components';
import type { Creation, VersionHistoryResponse, ImportResponse } from '../../types/api';
import { 
  Search, 
  Download, 
  Upload, 
  Link, 
  FileText, 
  Code, 
  Globe, 
  Palette, 
  Terminal, 
  Copy,
  Trash2,
  Clock,
  Star,
  Filter,
  X
} from 'lucide-react';

const CreationHistory: React.FC<CreationHistoryProps> = ({ creations, setCreations }) => {
  const [selectedCreation, setSelectedCreation] = useState<number | null>(null);
  const [showLinker, setShowLinker] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [typeFilter, setTypeFilter] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('created_at');
  const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>('DESC');
  const [filteredCreations, setFilteredCreations] = useState<Creation[]>(creations);
  const [selectedForExport, setSelectedForExport] = useState<number[]>([]);
  const [showExportOptions, setShowExportOptions] = useState<boolean>(false);
  const [showImportDialog, setShowImportDialog] = useState<boolean>(false);
  const [showVersionHistory, setShowVersionHistory] = useState<Record<number, boolean>>({});
  const [versionHistories, setVersionHistories] = useState<Record<number, VersionHistoryResponse>>({});
  const [showTemplateBrowser, setShowTemplateBrowser] = useState<boolean>(false);

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

  const handleDeleteCreation = (id: number): void => {
    setCreations(prev => prev.filter(creation => creation.id !== id));
  };

  const copyToClipboard = (code: string): void => {
    navigator.clipboard.writeText(code);
    // You could add a toast notification here
  };

  const handleLink = (linkData: { sourceId: number; targetIds: number[]; linkType: string }): void => {
    console.log('Creations linked:', linkData);
    // Update creation with links information
    setCreations(prev => prev.map(creation => {
      if (creation.id === linkData.sourceId) {
        return {
          ...creation,
          links: [...(creation.links || []), ...linkData.targetIds.map(id => ({
            targetId: id,
            type: linkData.linkType as 'reference' | 'extends' | 'imports' | 'dependency',
            timestamp: new Date()
          }))]
        };
      }
      return creation;
    }));
  };

  const clearFilters = (): void => {
    setSearchTerm('');
    setTypeFilter('');
    setSortBy('created_at');
    setSortOrder('DESC');
  };

  const handleExportSingle = async (creation: Creation): Promise<void> => {
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

  const handleExportMultiple = async (): Promise<void> => {
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

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const importData = JSON.parse(text);
      
      const result = await creationService.importCreations(importData, {
        overwriteExisting: false,
        preserveLinks: true
      }) as ImportResponse;

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

  const toggleExportSelection = (creationId: number): void => {
    setSelectedForExport(prev => 
      prev.includes(creationId)
        ? prev.filter(id => id !== creationId)
        : [...prev, creationId]
    );
  };

  const handleViewVersionHistory = async (creation: Creation): Promise<void> => {
    try {
      const versionData = await creationService.getVersionHistory(creation.id);
      setVersionHistories(prev => ({
        ...prev,
        [creation.id]: versionData
      }));
      setShowVersionHistory(prev => ({
        ...prev,
        [creation.id]: !prev[creation.id]
      }));
    } catch (error) {
      console.error('Failed to fetch version history:', error);
      alert('Failed to load version history. Please try again.');
    }
  };

  const handleRestoreVersion = async (baseId: number, versionId: number, versionNumber: number): Promise<void> => {
    if (!window.confirm(`Are you sure you want to restore version ${versionNumber}? This will create a new version.`)) {
      return;
    }

    try {
      await creationService.restoreVersion(baseId, versionId);
      alert('Version restored successfully!');
      // Refresh the creation list
      window.location.reload();
    } catch (error) {
      console.error('Failed to restore version:', error);
      alert('Failed to restore version. Please try again.');
    }
  };

  const handleMakeTemplate = async (creation: Creation): Promise<void> => {
    const category = prompt('Enter template category (optional):', 'User Templates');
    if (category === null) return; // User cancelled

    try {
      await creationService.makeTemplate(creation.id, category || 'User Templates');
      alert(`"${creation.name}" has been marked as a template!`);
      // Refresh the creation list
      window.location.reload();
    } catch (error) {
      console.error('Failed to make template:', error);
      alert('Failed to make template. Please try again.');
    }
  };

  const handleRemoveTemplate = async (creation: Creation): Promise<void> => {
    if (!window.confirm(`Remove template status from "${creation.name}"?`)) {
      return;
    }

    try {
      await creationService.removeTemplate(creation.id);
      alert('Template status removed successfully!');
      // Refresh the creation list
      window.location.reload();
    } catch (error) {
      console.error('Failed to remove template:', error);
      alert('Failed to remove template status. Please try again.');
    }
  };

  const handleTemplateSelect = (newCreation: Creation, template: any): void => {
    // Add the new creation to the list
    setCreations(prev => [newCreation, ...prev]);
  };

  const getTypeIcon = (type: string) => {
    const icons = {
      code: Code,
      api: Globe,
      ui: Palette,
      cli: Terminal
    };
    return icons[type as keyof typeof icons] || FileText;
  };

  const getTypeColor = (type: string) => {
    const colors = {
      code: 'bg-blue-500/20 text-blue-300 border-blue-400/30',
      api: 'bg-green-500/20 text-green-300 border-green-400/30',
      ui: 'bg-purple-500/20 text-purple-300 border-purple-400/30',
      cli: 'bg-orange-500/20 text-orange-300 border-orange-400/30'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-500/20 text-gray-300 border-gray-400/30';
  };

  const hasActiveFilters = searchTerm || typeFilter || sortBy !== 'created_at' || sortOrder !== 'DESC';

  return (
    <div className="h-full space-y-4">
      {/* Header */}
      <GlassPanel className="p-4" variant="elevated" animate={false}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-white" />
            <h3 className="text-lg font-semibold text-white">Creation History</h3>
          </div>
          <div className="flex gap-2">
            <GlassButton
              variant="secondary"
              onClick={() => setShowTemplateBrowser(true)}
              className="text-sm px-3 py-1.5"
            >
              <FileText className="w-4 h-4 mr-1" />
              Templates
            </GlassButton>
            {creations.length > 0 && (
              <>
                <GlassButton
                  variant="secondary"
                  onClick={() => setShowExportOptions(!showExportOptions)}
                  className="text-sm px-3 py-1.5"
                >
                  <Download className="w-4 h-4 mr-1" />
                  Export
                </GlassButton>
                <GlassButton
                  variant="secondary"
                  onClick={() => setShowImportDialog(true)}
                  className="text-sm px-3 py-1.5"
                >
                  <Upload className="w-4 h-4 mr-1" />
                  Import
                </GlassButton>
                <GlassButton
                  variant="secondary"
                  onClick={() => setShowLinker(!showLinker)}
                  className="text-sm px-3 py-1.5"
                >
                  <Link className="w-4 h-4 mr-1" />
                  Link Mode
                </GlassButton>
              </>
            )}
            {creations.length === 0 && (
              <GlassButton
                variant="secondary"
                onClick={() => setShowImportDialog(true)}
                className="text-sm px-3 py-1.5"
              >
                <Upload className="w-4 h-4 mr-1" />
                Import
              </GlassButton>
            )}
          </div>
        </div>
      </GlassPanel>

      {/* Import Dialog */}
      {showImportDialog && (
        <GlassPanel className="p-4" gradient="neon">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium text-white">Import Creations</h4>
            <button
              onClick={() => setShowImportDialog(false)}
              className="text-white/70 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-3">
            <p className="text-sm text-white/80">
              Select a JSON file exported from AetherOS to import creations.
            </p>
            <input
              type="file"
              accept=".json"
              onChange={handleImport}
              className="block w-full text-sm text-white/80 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-white/20 file:text-white hover:file:bg-white/30"
            />
          </div>
        </GlassPanel>
      )}

      {/* Export Options */}
      {showExportOptions && (
        <GlassPanel className="p-4" gradient="neon">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium text-white">Export Options</h4>
            <button
              onClick={() => setShowExportOptions(false)}
              className="text-white/70 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-3">
            <div className="flex gap-2">
              <GlassButton
                onClick={handleExportMultiple}
                variant="primary"
                className="text-sm"
              >
                Export All Creations
              </GlassButton>
              {selectedForExport.length > 0 && (
                <GlassButton
                  onClick={handleExportMultiple}
                  variant="primary"
                  className="text-sm"
                >
                  Export Selected ({selectedForExport.length})
                </GlassButton>
              )}
            </div>
            <p className="text-sm text-white/80">
              Select individual creations below and click their export button, or use selection mode to export multiple at once.
            </p>
          </div>
        </GlassPanel>
      )}

      {/* Search and Filter Controls */}
      {creations.length > 0 && (
        <GlassPanel className="p-4" animate={false}>
          {/* Search Bar */}
          <div className="relative mb-3">
            <GlassInput
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Search creations by name, description, or content..."
              icon={<Search className="w-4 h-4" />}
            />
          </div>

          {/* Filter Controls */}
          <div className="flex flex-wrap gap-2 items-center">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-1.5 bg-white/10 border border-white/20 backdrop-blur-md text-white rounded-lg text-sm focus:outline-none focus:bg-white/15 focus:border-white/30"
            >
              <option value="">All Types</option>
              <option value="code">Code</option>
              <option value="api">API</option>
              <option value="ui">UI</option>
              <option value="cli">CLI</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-1.5 bg-white/10 border border-white/20 backdrop-blur-md text-white rounded-lg text-sm focus:outline-none focus:bg-white/15 focus:border-white/30"
            >
              <option value="created_at">Sort by Created</option>
              <option value="updated_at">Sort by Modified</option>
              <option value="name">Sort by Name</option>
              <option value="type">Sort by Type</option>
            </select>

            <button
              onClick={() => setSortOrder(sortOrder === 'ASC' ? 'DESC' : 'ASC')}
              className="px-3 py-1.5 bg-white/10 border border-white/20 backdrop-blur-md text-white rounded-lg text-sm hover:bg-white/20 focus:outline-none transition-all"
              title={`Sort ${sortOrder === 'ASC' ? 'Descending' : 'Ascending'}`}
            >
              {sortOrder === 'ASC' ? '↑' : '↓'}
            </button>

            {hasActiveFilters && (
              <GlassButton
                onClick={clearFilters}
                variant="danger"
                className="text-sm px-3 py-1.5"
              >
                <Filter className="w-3 h-3 mr-1" />
                Clear Filters
              </GlassButton>
            )}

            <div className="text-sm text-white/70">
              {filteredCreations.length} of {creations.length} creations
            </div>
          </div>
        </GlassPanel>
      )}
      
      {showLinker && creations.length > 0 && (
        <GlassPanel className="p-4">
          <CreationLinker
            creations={creations}
            onLink={handleLink}
            currentCreationId={null}
          />
        </GlassPanel>
      )}
      
      {creations.length === 0 ? (
        <GlassPanel className="p-8 text-center">
          <div className="text-white/70 text-sm">
            Your generated creations will appear here. Start by asking me to create something!
          </div>
        </GlassPanel>
      ) : filteredCreations.length === 0 ? (
        <GlassPanel className="p-8 text-center">
          <div className="text-white/70 text-sm">
            No creations match your current filters.
            <button
              onClick={clearFilters}
              className="ml-2 text-white hover:text-white/80 underline"
            >
              Clear filters
            </button>
          </div>
        </GlassPanel>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {filteredCreations.map(creation => {
            const TypeIcon = getTypeIcon(creation.type);
            
            return (
              <GlassPanel 
                key={creation.id} 
                className={`p-4 cursor-pointer transition-all ${
                  selectedCreation === creation.id ? 'ring-2 ring-white/40' : ''
                }`}
                gradient={selectedCreation === creation.id ? 'neon' : 'default'}
                onClick={() => showLinker && setSelectedCreation(creation.id)}
                animate={false}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2 flex-1">
                    {(showExportOptions || selectedForExport.length > 0) && (
                      <input
                        type="checkbox"
                        checked={selectedForExport.includes(creation.id)}
                        onChange={() => toggleExportSelection(creation.id)}
                        className="text-blue-600 bg-white/20 border-white/30 rounded"
                        onClick={(e) => e.stopPropagation()}
                      />
                    )}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <TypeIcon className="w-4 h-4 text-white" />
                        <h4 className="font-medium text-white text-sm">{creation.name}</h4>
                        <span className={`px-2 py-1 text-xs rounded-full border backdrop-blur-sm ${getTypeColor(creation.type)}`}>
                          {creation.type.toUpperCase()}
                        </span>
                        {creation.version && (
                          <span className="px-2 py-1 text-xs bg-white/10 text-white/80 rounded-full border border-white/20">
                            v{creation.version}
                            {creation.version_count && creation.version_count > 1 && ` (${creation.version_count} versions)`}
                          </span>
                        )}
                        {creation.is_template && (
                          <span className="px-2 py-1 text-xs bg-purple-500/20 text-purple-300 rounded-full border border-purple-400/30">
                            <Star className="w-3 h-3 inline mr-1" />
                            TEMPLATE
                          </span>
                        )}
                        {creation.executable && (
                          <span className="px-2 py-1 text-xs bg-green-500/20 text-green-300 rounded-full border border-green-400/30">
                            EXECUTABLE
                          </span>
                        )}
                      </div>
                      <p className="text-white/80 text-xs mb-2 line-clamp-2">{creation.description}</p>
                      
                      {creation.links && creation.links.length > 0 && (
                        <div className="mb-2">
                          <div className="text-xs text-purple-300 mb-1">
                            <Link className="w-3 h-3 inline mr-1" />
                            Linked to {creation.links.length} creation(s)
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {creation.links.map((link, index) => (
                              <span key={index} className="px-2 py-1 text-xs bg-purple-500/20 text-purple-300 rounded border border-purple-400/30">
                                {link.type}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      <div className="flex items-center mt-2 space-x-2">
                        <span className="text-xs text-white/60">
                          {new Date(creation.timestamp).toLocaleDateString()}
                        </span>
                        {creation.framework && (
                          <span className="text-xs text-white/60">
                            • {creation.framework}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-1 ml-2">
                    {creation.version_count && creation.version_count > 1 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewVersionHistory(creation);
                        }}
                        className="text-white/60 hover:text-white p-1 hover:bg-white/10 rounded transition-colors"
                        title="View version history"
                      >
                        <Clock className="w-4 h-4" />
                      </button>
                    )}
                    {creation.is_template ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveTemplate(creation);
                        }}
                        className="text-white/60 hover:text-purple-300 p-1 hover:bg-white/10 rounded transition-colors"
                        title="Remove template status"
                      >
                        <Star className="w-4 h-4" />
                      </button>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMakeTemplate(creation);
                        }}
                        className="text-white/60 hover:text-purple-300 p-1 hover:bg-white/10 rounded transition-colors"
                        title="Make template"
                      >
                        <Star className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleExportSingle(creation);
                      }}
                      className="text-white/60 hover:text-blue-300 p-1 hover:bg-white/10 rounded transition-colors"
                      title="Export this creation"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    {creation.content && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          copyToClipboard(creation.content);
                        }}
                        className="text-white/60 hover:text-white p-1 hover:bg-white/10 rounded transition-colors"
                        title="Copy content"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteCreation(creation.id);
                      }}
                      className="text-white/60 hover:text-red-400 p-1 hover:bg-white/10 rounded transition-colors"
                      title="Delete creation"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Version History Section */}
                {showVersionHistory[creation.id] && versionHistories[creation.id] && (
                  <div className="mt-3 border-t border-white/20 pt-3">
                    <h5 className="text-sm font-medium text-white/90 mb-2">Version History</h5>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {versionHistories[creation.id].versions.map((version, index) => (
                        <div 
                          key={version.id} 
                          className={`p-2 rounded text-xs border ${
                            version.is_current_version 
                              ? 'bg-green-500/20 border-green-400/30 text-green-300' 
                              : 'bg-white/5 border-white/20 text-white/80'
                          }`}
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <span className="font-medium">Version {version.version}</span>
                              {version.is_current_version && (
                                <span className="ml-2 px-1 py-0.5 bg-green-500/30 text-green-300 rounded text-xs">Current</span>
                              )}
                              <div className="text-white/60 mt-1">
                                {new Date(version.created_at).toLocaleString()}
                              </div>
                            </div>
                            {!version.is_current_version && (
                              <GlassButton
                                onClick={() => handleRestoreVersion(versionHistories[creation.id].baseCreationId, version.id, version.version)}
                                variant="secondary"
                                className="text-xs px-2 py-1"
                              >
                                Restore
                              </GlassButton>
                            )}
                          </div>
                          {version.description && (
                            <div className="mt-1 text-white/70 text-xs">
                              {version.description.substring(0, 100)}
                              {version.description.length > 100 && '...'}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {creation.content && (
                  <details className="mt-3">
                    <summary className="text-xs text-white/80 cursor-pointer hover:text-white flex items-center gap-1">
                      <span>View Content</span>
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </summary>
                    <div className="mt-2 bg-black/40 text-green-300 p-3 rounded-lg text-xs font-mono overflow-x-auto border border-white/10">
                      <pre>{creation.content}</pre>
                    </div>
                  </details>
                )}
              </GlassPanel>
            );
          })}
        </div>
      )}

      {/* Template Browser */}
      {showTemplateBrowser && (
        <TemplateBrowser
          onTemplateSelect={handleTemplateSelect}
          onClose={() => setShowTemplateBrowser(false)}
        />
      )}
    </div>
  );
};

export default CreationHistory;