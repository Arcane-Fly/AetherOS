import React from 'react';

/**
 * Sample Button Component demonstrating AetherOS naming conventions
 * - Component name: PascalCase
 * - Props interface: PascalCase with 'Props' suffix
 * - Variables: camelCase
 * - Constants: UPPER_SNAKE_CASE
 */

interface SampleButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

// Example constant
const DEFAULT_TRANSITION_DURATION = '200ms';

const SampleButton: React.FC<SampleButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  disabled = false,
  className = '',
}) => {
  // Example variables using camelCase
  const baseClasses = 'font-medium rounded-lg transition-all duration-200';
  const isDisabled = disabled;

  // Example object with camelCase keys
  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500',
    outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50 focus:ring-blue-500',
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  // Example function using camelCase
  const handleClick = () => {
    if (!isDisabled && onClick) {
      onClick();
    }
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${
        isDisabled ? 'opacity-50 cursor-not-allowed' : ''
      } ${className}`}
      onClick={handleClick}
      disabled={isDisabled}
      style={{ transitionDuration: DEFAULT_TRANSITION_DURATION }}
    >
      {children}
    </button>
  );
};

export default SampleButton;
