import React from 'react';
import { motion } from 'framer-motion';
import { getGlassClasses, glassVariants, glassAnimations, type GlassThemeName } from '../../styles/glass-theme';

// Glass Panel Component
interface GlassPanelProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'elevated' | 'floating' | 'subtle';
  gradient?: GlassThemeName;
  animate?: boolean;
}

export const GlassPanel: React.FC<GlassPanelProps> = ({
  children,
  className = '',
  variant = 'floating',
  gradient = 'default',
  animate = true
}) => {
  const baseClasses = variant ? glassVariants.panel[variant] : getGlassClasses(gradient);
  const animationClasses = animate ? glassAnimations.fadeIn : '';
  
  const Component = animate ? motion.div : 'div';
  const motionProps = animate ? {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.3 }
  } : {};

  return (
    <Component
      className={`${baseClasses} ${animationClasses} ${className}`}
      {...motionProps}
    >
      {children}
    </Component>
  );
};

// Glass Button Component  
interface GlassButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

export const GlassButton: React.FC<GlassButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  disabled = false,
  loading = false,
  className = '',
  type = 'button'
}) => {
  const baseClasses = glassVariants.button[variant];
  const disabledClasses = disabled || loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer';
  
  return (
    <motion.button
      type={type}
      onClick={disabled || loading ? undefined : onClick}
      disabled={disabled || loading}
      className={`
        ${baseClasses}
        ${disabledClasses}
        px-6 py-2 rounded-lg
        font-medium text-white
        transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-white/50
        ${className}
      `}
      whileHover={disabled || loading ? {} : { scale: 1.02 }}
      whileTap={disabled || loading ? {} : { scale: 0.98 }}
    >
      {loading ? (
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          <span>Loading...</span>
        </div>
      ) : (
        children
      )}
    </motion.button>
  );
};

// Glass Input Component
interface GlassInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: 'text' | 'email' | 'password' | 'number';
  disabled?: boolean;
  className?: string;
  icon?: React.ReactNode;
}

export const GlassInput: React.FC<GlassInputProps> = ({
  value,
  onChange,
  placeholder = '',
  type = 'text',
  disabled = false,
  className = '',
  icon
}) => {
  const baseClasses = glassVariants.input.default;
  
  return (
    <div className={`relative ${className}`}>
      {icon && (
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60">
          {icon}
        </div>
      )}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className={`
          ${baseClasses}
          w-full px-4 py-3 rounded-lg
          ${icon ? 'pl-10' : ''}
          text-white placeholder-white/50
          transition-all duration-200
          focus:outline-none focus:ring-2 focus:ring-white/50
        `}
      />
    </div>
  );
};

// Glass Card Component
interface GlassCardProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  className?: string;
  gradient?: GlassThemeName;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  title,
  subtitle,
  className = '',
  gradient = 'default'
}) => {
  return (
    <motion.div
      className={`${getGlassClasses(gradient)} p-6 ${className}`}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
      whileHover={{ y: -2 }}
    >
      {(title || subtitle) && (
        <div className="mb-4">
          {title && (
            <h3 className="text-lg font-semibold text-white mb-1">{title}</h3>
          )}
          {subtitle && (
            <p className="text-white/70 text-sm">{subtitle}</p>
          )}
        </div>
      )}
      {children}
    </motion.div>
  );
};

// Glass Modal Component
interface GlassModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  className?: string;
}

export const GlassModal: React.FC<GlassModalProps> = ({
  isOpen,
  onClose,
  children,
  title,
  className = ''
}) => {
  if (!isOpen) return null;

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <motion.div
        className={`relative ${getGlassClasses('default')} max-w-lg w-full max-h-[80vh] overflow-auto ${className}`}
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
      >
        {title && (
          <div className="flex items-center justify-between p-6 border-b border-white/20">
            <h2 className="text-xl font-semibold text-white">{title}</h2>
            <button
              onClick={onClose}
              className="text-white/60 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
        <div className="p-6">
          {children}
        </div>
      </motion.div>
    </motion.div>
  );
};

// Glass Navbar Component
interface GlassNavbarProps {
  children: React.ReactNode;
  className?: string;
  gradient?: GlassThemeName;
}

export const GlassNavbar: React.FC<GlassNavbarProps> = ({
  children,
  className = '',
  gradient = 'default'
}) => {
  return (
    <nav className={`${getGlassClasses(gradient)} fixed top-0 left-0 right-0 z-40 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {children}
        </div>
      </div>
    </nav>
  );
};

// Glass Sidebar Component
interface GlassSidebarProps {
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  side?: 'left' | 'right';
  className?: string;
  gradient?: GlassThemeName;
}

export const GlassSidebar: React.FC<GlassSidebarProps> = ({
  children,
  isOpen,
  onClose,
  side = 'left',
  className = '',
  gradient = 'default'
}) => {
  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <motion.div
        className={`
          fixed top-0 ${side === 'left' ? 'left-0' : 'right-0'} h-full w-80 z-40
          ${getGlassClasses(gradient)} ${className}
        `}
        initial={{ x: side === 'left' ? -320 : 320 }}
        animate={{ x: isOpen ? 0 : (side === 'left' ? -320 : 320) }}
        transition={{ type: 'spring', damping: 25, stiffness: 120 }}
      >
        {children}
      </motion.div>
    </>
  );
};