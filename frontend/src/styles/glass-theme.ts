// Glass Morphism Theme Configuration
export interface GlassTheme {
  blur: string;
  opacity: string;
  border: string;
  gradient: string;
  shadow: string;
}

export const glassThemes = {
  default: {
    blur: 'backdrop-blur-md',
    opacity: 'bg-white/10',
    border: 'border border-white/20',
    gradient: 'bg-gradient-to-br from-white/20 to-white/5',
    shadow: 'shadow-xl',
  },
  dark: {
    blur: 'backdrop-blur-lg',
    opacity: 'bg-black/20',
    border: 'border border-white/10',
    gradient: 'bg-gradient-to-br from-black/30 to-black/10',
    shadow: 'shadow-2xl',
  },
  rainbow: {
    blur: 'backdrop-blur-lg',
    opacity: 'bg-white/15',
    border: 'border border-white/30',
    gradient: 'bg-gradient-to-br from-purple-500/20 via-blue-500/20 to-teal-500/20',
    shadow: 'shadow-2xl shadow-purple-500/10',
  },
  neon: {
    blur: 'backdrop-blur-md',
    opacity: 'bg-cyan-500/10',
    border: 'border border-cyan-400/30',
    gradient: 'bg-gradient-to-br from-cyan-500/20 to-blue-600/20',
    shadow: 'shadow-2xl shadow-cyan-500/20',
  },
  warm: {
    blur: 'backdrop-blur-lg',
    opacity: 'bg-orange-500/10',
    border: 'border border-orange-300/30',
    gradient: 'bg-gradient-to-br from-orange-500/20 to-red-500/20',
    shadow: 'shadow-xl shadow-orange-500/20',
  },
} as const;

export type GlassThemeName = keyof typeof glassThemes;

// Glass effect utilities
export const getGlassClasses = (theme: GlassThemeName = 'default'): string => {
  const themeConfig = glassThemes[theme];
  return [
    themeConfig.blur,
    themeConfig.opacity,
    themeConfig.border,
    themeConfig.gradient,
    themeConfig.shadow,
    'rounded-xl',
    'transition-all',
    'duration-300',
  ].join(' ');
};

// Background gradients for full-screen layouts
export const backgroundGradients = {
  aurora: 'bg-gradient-to-br from-purple-900 via-blue-900 to-teal-900',
  cosmic: 'bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900',
  ocean: 'bg-gradient-to-br from-blue-900 via-teal-900 to-cyan-900',
  sunset: 'bg-gradient-to-br from-orange-900 via-red-900 to-pink-900',
  forest: 'bg-gradient-to-br from-green-900 via-emerald-900 to-teal-900',
} as const;

export type BackgroundGradientName = keyof typeof backgroundGradients;

// Component-specific glass variants
export const glassVariants = {
  button: {
    primary: 'bg-white/20 hover:bg-white/30 border border-white/30 backdrop-blur-md shadow-lg',
    secondary: 'bg-black/10 hover:bg-black/20 border border-white/20 backdrop-blur-md shadow-md',
    danger: 'bg-red-500/20 hover:bg-red-500/30 border border-red-400/30 backdrop-blur-md shadow-lg',
    success:
      'bg-green-500/20 hover:bg-green-500/30 border border-green-400/30 backdrop-blur-md shadow-lg',
  },
  panel: {
    elevated: 'bg-white/15 border border-white/25 backdrop-blur-lg shadow-2xl',
    floating: 'bg-white/10 border border-white/20 backdrop-blur-md shadow-xl',
    subtle: 'bg-white/5 border border-white/10 backdrop-blur-sm shadow-lg',
  },
  input: {
    default:
      'bg-white/10 border border-white/20 backdrop-blur-md focus:bg-white/15 focus:border-white/30',
    focused: 'bg-white/15 border border-white/30 backdrop-blur-lg shadow-inner',
  },
} as const;

// Animation utilities for glass effects
export const glassAnimations = {
  fadeIn: 'animate-in fade-in-0 duration-300',
  slideIn: 'animate-in slide-in-from-bottom-4 duration-300',
  scaleIn: 'animate-in zoom-in-95 duration-200',
  glowPulse: 'animate-pulse shadow-lg shadow-current/20',
} as const;

// Z-index layers for floating elements
export const zLayers = {
  base: 'z-0',
  content: 'z-10',
  overlay: 'z-20',
  modal: 'z-30',
  floating: 'z-40',
  tooltip: 'z-50',
} as const;
