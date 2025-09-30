import React, { useEffect, useRef } from 'react';
import Editor, { OnMount } from '@monaco-editor/react';
import { motion } from 'framer-motion';

interface MonacoEditorProps {
  value: string;
  onChange?: (value: string | undefined) => void;
  language?: string;
  theme?: 'vs-dark' | 'light' | 'hc-black';
  height?: string | number;
  width?: string | number;
  options?: any;
  className?: string;
  loading?: React.ReactNode;
}

export const MonacoEditor: React.FC<MonacoEditorProps> = ({
  value,
  onChange,
  language = 'typescript',
  theme = 'vs-dark',
  height = '400px',
  width = '100%',
  options = {},
  className = '',
  loading
}) => {
  const editorRef = useRef<any>(null);

  const handleEditorDidMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;
    
    // Configure Monaco for better TypeScript experience
    monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
      target: monaco.languages.typescript.ScriptTarget.ES2020,
      allowNonTsExtensions: true,
      moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
      module: monaco.languages.typescript.ModuleKind.CommonJS,
      noEmit: true,
      esModuleInterop: true,
      jsx: monaco.languages.typescript.JsxEmit.React,
      reactNamespace: 'React',
      allowJs: true,
      typeRoots: ['node_modules/@types']
    });

    // Add React types
    monaco.languages.typescript.typescriptDefaults.addExtraLib(
      `declare module 'react' {
        export * from '@types/react';
      }`,
      'react.d.ts'
    );

    // Custom theme for glass morphism
    monaco.editor.defineTheme('glassmorphism', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '6A9955', fontStyle: 'italic' },
        { token: 'keyword', foreground: '569CD6' },
        { token: 'string', foreground: 'CE9178' },
        { token: 'number', foreground: 'B5CEA8' },
      ],
      colors: {
        'editor.background': '#00000000', // Transparent background for glass effect
        'editor.foreground': '#D4D4D4',
        'editor.lineHighlightBackground': '#FFFFFF0A',
        'editor.selectionBackground': '#264F78',
        'editor.inactiveSelectionBackground': '#3A3D41',
      }
    });

    // Set the custom theme
    monaco.editor.setTheme('glassmorphism');
  };

  const defaultOptions = {
    automaticLayout: true,
    fontSize: 14,
    fontFamily: '"Fira Code", "Cascadia Code", "JetBrains Mono", monospace',
    fontLigatures: true,
    lineNumbers: 'on',
    roundedSelection: false,
    scrollBeyondLastLine: false,
    minimap: { enabled: true },
    folding: true,
    foldingHighlight: true,
    foldingStrategy: 'indentation',
    showFoldingControls: 'mouseover',
    unfoldOnClickAfterEndOfLine: false,
    contextmenu: true,
    mouseWheelZoom: true,
    multiCursorModifier: 'alt',
    accessibilitySupport: 'auto',
    quickSuggestions: {
      other: true,
      comments: false,
      strings: false
    },
    parameterHints: { enabled: true },
    autoClosingBrackets: 'always',
    autoClosingQuotes: 'always',
    autoSurround: 'languageDefined',
    smoothScrolling: true,
    cursorBlinking: 'blink',
    cursorSmoothCaretAnimation: true,
    renderWhitespace: 'selection',
    renderControlCharacters: false,
    ...options
  };

  const loadingComponent = loading || (
    <motion.div 
      className="flex items-center justify-center h-full bg-black/20 rounded-lg backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-2" />
        <div className="text-white/70 text-sm">Loading Editor...</div>
      </div>
    </motion.div>
  );

  return (
    <div className={`relative ${className}`}>
      <Editor
        height={height}
        width={width}
        language={language}
        value={value}
        theme={theme}
        onChange={onChange}
        onMount={handleEditorDidMount}
        loading={loadingComponent}
        options={defaultOptions}
      />
    </div>
  );
};

// Code Editor with Glass Panel wrapper
interface GlassCodeEditorProps extends MonacoEditorProps {
  title?: string;
  actions?: React.ReactNode;
  footer?: React.ReactNode;
}

export const GlassCodeEditor: React.FC<GlassCodeEditorProps> = ({
  title,
  actions,
  footer,
  className = '',
  ...editorProps
}) => {
  return (
    <motion.div
      className={`
        bg-white/5 backdrop-blur-lg border border-white/20 rounded-xl shadow-2xl
        overflow-hidden ${className}
      `}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      {(title || actions) && (
        <div className="flex items-center justify-between p-4 border-b border-white/20 bg-white/5">
          {title && (
            <h3 className="text-white font-semibold flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
              {title}
            </h3>
          )}
          {actions && (
            <div className="flex items-center gap-2">
              {actions}
            </div>
          )}
        </div>
      )}

      {/* Editor */}
      <div className="relative">
        <MonacoEditor {...editorProps} />
      </div>

      {/* Footer */}
      {footer && (
        <div className="p-4 border-t border-white/20 bg-white/5">
          {footer}
        </div>
      )}
    </motion.div>
  );
};

// Language selector component
interface LanguageSelectorProps {
  value: string;
  onChange: (language: string) => void;
  className?: string;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  value,
  onChange,
  className = ''
}) => {
  const languages = [
    { value: 'typescript', label: 'TypeScript', icon: '🟦' },
    { value: 'javascript', label: 'JavaScript', icon: '🟨' },
    { value: 'python', label: 'Python', icon: '🐍' },
    { value: 'rust', label: 'Rust', icon: '🦀' },
    { value: 'go', label: 'Go', icon: '🐹' },
    { value: 'java', label: 'Java', icon: '☕' },
    { value: 'cpp', label: 'C++', icon: '⚡' },
    { value: 'html', label: 'HTML', icon: '🌐' },
    { value: 'css', label: 'CSS', icon: '🎨' },
    { value: 'json', label: 'JSON', icon: '📋' },
    { value: 'yaml', label: 'YAML', icon: '📄' },
    { value: 'markdown', label: 'Markdown', icon: '📝' }
  ];

  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`
        bg-white/10 border border-white/20 backdrop-blur-md
        text-white px-3 py-2 rounded-lg text-sm
        focus:bg-white/15 focus:border-white/30 focus:outline-none
        transition-all duration-200 ${className}
      `}
    >
      {languages.map((lang) => (
        <option 
          key={lang.value} 
          value={lang.value}
          className="bg-gray-800 text-white"
        >
          {lang.icon} {lang.label}
        </option>
      ))}
    </select>
  );
};

export default MonacoEditor;