import React, { useState, useRef } from 'react';
import { Rnd } from 'react-rnd';
import { motion, AnimatePresence } from 'framer-motion';
import { getGlassClasses, zLayers } from '../../styles/glass-theme';
import { LucideIcon } from 'lucide-react';

interface FloatingWindowProps {
  id: string;
  title: string;
  icon?: LucideIcon;
  children: React.ReactNode;
  onClose?: () => void;
  onMinimize?: () => void;
  onMaximize?: () => void;
  initialPosition?: { x: number; y: number };
  initialSize?: { width: number; height: number };
  minWidth?: number;
  minHeight?: number;
  maxWidth?: number;
  maxHeight?: number;
  resizable?: boolean;
  draggable?: boolean;
  className?: string;
}

export const FloatingWindow: React.FC<FloatingWindowProps> = ({
  id,
  title,
  icon: Icon,
  children,
  onClose,
  onMinimize,
  onMaximize,
  initialPosition = { x: 100, y: 100 },
  initialSize = { width: 600, height: 400 },
  minWidth = 300,
  minHeight = 200,
  maxWidth = 1200,
  maxHeight = 800,
  resizable = true,
  draggable = true,
  className = '',
}) => {
  const [isMaximized, setIsMaximized] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [zIndex, setZIndex] = useState(40);

  const windowRef = useRef<any>(null);
  const [lastPosition, setLastPosition] = useState(initialPosition);
  const [lastSize, setLastSize] = useState(initialSize);

  const handleMaximize = () => {
    if (!isMaximized) {
      // Store current position and size before maximizing
      const current = windowRef.current;
      if (current) {
        setLastPosition(current.getPosition());
        setLastSize(current.getSize());
      }
    }
    setIsMaximized(!isMaximized);
    onMaximize?.();
  };

  const handleMinimize = () => {
    setIsMinimized(!isMinimized);
    onMinimize?.();
  };

  const handleFocus = () => {
    setZIndex(50); // Bring to front
  };

  const handleBlur = () => {
    setZIndex(40); // Send to back
  };

  const windowPosition = isMaximized ? { x: 0, y: 0 } : lastPosition;

  const windowSize = isMaximized ? { width: '100vw', height: '100vh' } : lastSize;

  if (isMinimized) {
    return (
      <motion.div
        className={`fixed bottom-4 left-4 ${getGlassClasses('default')} p-3 cursor-pointer ${zLayers.floating}`}
        style={{ zIndex }}
        onClick={handleMinimize}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 20, opacity: 0 }}
      >
        <div className="flex items-center gap-2 text-white">
          {Icon && <Icon className="w-4 h-4" />}
          <span className="text-sm font-medium">{title}</span>
        </div>
      </motion.div>
    );
  }

  return (
    <AnimatePresence>
      <Rnd
        ref={windowRef}
        size={windowSize}
        position={windowPosition}
        minWidth={minWidth}
        minHeight={minHeight}
        maxWidth={maxWidth}
        maxHeight={maxHeight}
        disableDragging={!draggable || isMaximized}
        enableResizing={resizable && !isMaximized}
        dragHandleClassName="window-drag-handle"
        onMouseDown={handleFocus}
        style={{ zIndex }}
        className={className}
      >
        <motion.div
          className={`
            h-full flex flex-col
            ${getGlassClasses('default')}
            ${isMaximized ? 'rounded-none' : 'rounded-xl'}
            overflow-hidden
          `}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.2 }}
          onFocus={handleFocus}
          onBlur={handleBlur}
          tabIndex={-1}
        >
          {/* Window Header */}
          <div className="window-drag-handle flex items-center justify-between p-4 border-b border-white/20 bg-white/5">
            <div className="flex items-center gap-2 text-white">
              {Icon && <Icon className="w-5 h-5" />}
              <h3 className="font-semibold text-sm">{title}</h3>
            </div>

            {/* Window Controls */}
            <div className="flex items-center gap-1">
              {onMinimize && (
                <button
                  onClick={handleMinimize}
                  className="w-6 h-6 rounded-full bg-yellow-500/80 hover:bg-yellow-500 transition-colors flex items-center justify-center"
                  title="Minimize"
                >
                  <svg className="w-3 h-3 text-black" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M3 10h14v2H3z" />
                  </svg>
                </button>
              )}

              {onMaximize && (
                <button
                  onClick={handleMaximize}
                  className="w-6 h-6 rounded-full bg-green-500/80 hover:bg-green-500 transition-colors flex items-center justify-center"
                  title={isMaximized ? 'Restore' : 'Maximize'}
                >
                  <svg className="w-3 h-3 text-black" fill="currentColor" viewBox="0 0 20 20">
                    {isMaximized ? (
                      <path d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V4a2 2 0 00-2-2H6zm0 2h8v12H6V4z" />
                    ) : (
                      <path d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
                    )}
                  </svg>
                </button>
              )}

              {onClose && (
                <button
                  onClick={onClose}
                  className="w-6 h-6 rounded-full bg-red-500/80 hover:bg-red-500 transition-colors flex items-center justify-center"
                  title="Close"
                >
                  <svg
                    className="w-3 h-3 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Window Content */}
          <div className="flex-1 overflow-auto">{children}</div>
        </motion.div>
      </Rnd>
    </AnimatePresence>
  );
};

// Window Manager Hook for managing multiple windows
export interface WindowState {
  id: string;
  title: string;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  position: { x: number; y: number };
  size: { width: number; height: number };
}

export const useWindowManager = () => {
  const [windows, setWindows] = useState<Record<string, WindowState>>({});
  const [focusedWindow, setFocusedWindow] = useState<string | null>(null);
  const [nextZIndex, setNextZIndex] = useState(50);

  const createWindow = (id: string, title: string, options: Partial<WindowState> = {}) => {
    const defaultPosition = {
      x: 100 + Object.keys(windows).length * 30,
      y: 100 + Object.keys(windows).length * 30,
    };

    setWindows((prev) => ({
      ...prev,
      [id]: {
        id,
        title,
        isMinimized: false,
        isMaximized: false,
        zIndex: nextZIndex,
        position: defaultPosition,
        size: { width: 600, height: 400 },
        ...options,
      },
    }));

    setFocusedWindow(id);
    setNextZIndex((prev) => prev + 1);
  };

  const focusWindow = (id: string) => {
    setFocusedWindow(id);
    setWindows((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        zIndex: nextZIndex,
      },
    }));
    setNextZIndex((prev) => prev + 1);
  };

  const minimizeWindow = (id: string) => {
    setWindows((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        isMinimized: !prev[id].isMinimized,
      },
    }));
  };

  const maximizeWindow = (id: string) => {
    setWindows((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        isMaximized: !prev[id].isMaximized,
      },
    }));
  };

  const closeWindow = (id: string) => {
    setWindows((prev) => {
      const newWindows = { ...prev };
      delete newWindows[id];
      return newWindows;
    });

    if (focusedWindow === id) {
      const remainingWindows = Object.keys(windows).filter((wId) => wId !== id);
      setFocusedWindow(remainingWindows.length > 0 ? remainingWindows[0] : null);
    }
  };

  const updateWindowPosition = (id: string, position: { x: number; y: number }) => {
    setWindows((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        position,
      },
    }));
  };

  const updateWindowSize = (id: string, size: { width: number; height: number }) => {
    setWindows((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        size,
      },
    }));
  };

  return {
    windows,
    focusedWindow,
    createWindow,
    focusWindow,
    minimizeWindow,
    maximizeWindow,
    closeWindow,
    updateWindowPosition,
    updateWindowSize,
  };
};
