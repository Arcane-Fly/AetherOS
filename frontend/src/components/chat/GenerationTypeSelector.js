import React from 'react';

const GenerationTypeSelector = ({ value, onChange, disabled = false }) => {
  const types = [
    { value: 'code', label: '🔧 Code', description: 'Functions, scripts, algorithms' },
    { value: 'api', label: '🌐 API', description: 'REST endpoints, OpenAPI specs' },
    { value: 'ui', label: '🎨 UI Component', description: 'React components, interfaces' },
    { value: 'cli', label: '⚡ CLI Tool', description: 'Command-line utilities' }
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {types.map(type => (
        <button
          key={type.value}
          onClick={() => onChange(type.value)}
          disabled={disabled}
          className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            value === type.value
              ? 'bg-liquid-blue text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          title={type.description}
        >
          {type.label}
        </button>
      ))}
    </div>
  );
};

export default GenerationTypeSelector;