# CSS Style Guide

## CSS and Tailwind Standards for AetherOS

### Tailwind CSS Usage

**Prefer Tailwind utility classes for consistent design:**
```html
<!-- Good - Semantic ordering of classes -->
<div class="flex flex-col w-full max-w-md p-6 mx-auto bg-white rounded-lg shadow-lg">
  <h2 class="mb-4 text-xl font-semibold text-gray-900">User Profile</h2>
  <button class="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
    Save Changes
  </button>
</div>

<!-- Class ordering: layout → spacing → sizing → colors → typography → effects -->
```

### Custom CSS Guidelines

**Use custom CSS sparingly and with purpose:**
```css
/* Good - Use CSS custom properties for theme values */
:root {
  --color-primary: #3b82f6;
  --color-primary-dark: #2563eb;
  --spacing-unit: 0.25rem;
  --border-radius: 0.375rem;
}

/* Good - Component-specific styles when Tailwind isn't sufficient */
.chat-message {
  /* Complex animations or styles not available in Tailwind */
  animation: fadeInUp 0.3s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Good - Responsive design patterns */
.sidebar {
  @apply hidden lg:block;
}

@media (max-width: 768px) {
  .mobile-menu {
    @apply block;
  }
}
```

### Responsive Design

**Mobile-first approach with Tailwind breakpoints:**
```html
<!-- Good - Mobile-first responsive design -->
<div class="flex flex-col md:flex-row lg:gap-8">
  <aside class="w-full md:w-1/4 lg:w-1/5">
    <!-- Sidebar content -->
  </aside>
  <main class="w-full md:w-3/4 lg:w-4/5">
    <!-- Main content -->
  </main>
</div>

<!-- Good - Responsive typography -->
<h1 class="text-2xl md:text-3xl lg:text-4xl font-bold">
  AetherOS Dashboard
</h1>
```

### Component-Specific Styles

**Organize styles by component:**
```css
/* components/Button.css */
.btn-primary {
  @apply px-4 py-2 text-white bg-blue-600 rounded-md;
  @apply hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500;
  @apply disabled:opacity-50 disabled:cursor-not-allowed;
  @apply transition-colors duration-200;
}

.btn-secondary {
  @apply px-4 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-md;
  @apply hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500;
}

/* components/Card.css */
.card {
  @apply bg-white rounded-lg shadow-md overflow-hidden;
}

.card-header {
  @apply px-6 py-4 bg-gray-50 border-b border-gray-200;
}

.card-body {
  @apply p-6;
}
```

### Accessibility Considerations

**Ensure styles support accessibility:**
```css
/* Good - Focus indicators */
.focus-ring {
  @apply focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50;
}

/* Good - High contrast ratios */
.text-primary {
  @apply text-gray-900; /* Ensure sufficient contrast */
}

.text-secondary {
  @apply text-gray-700; /* Maintain readability */
}

/* Good - Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .animated {
    animation: none;
  }
  
  .transition {
    transition: none;
  }
}

/* Good - Print styles */
@media print {
  .no-print {
    @apply hidden;
  }
  
  .print-only {
    @apply block;
  }
}
```

### Dark Mode Support

**Design for both light and dark themes:**
```css
/* Good - Dark mode using Tailwind's dark variant */
.theme-card {
  @apply bg-white dark:bg-gray-800;
  @apply text-gray-900 dark:text-gray-100;
  @apply border border-gray-200 dark:border-gray-700;
}

/* Good - Custom properties for theme switching */
:root {
  --bg-primary: #ffffff;
  --text-primary: #111827;
  --border-color: #e5e7eb;
}

[data-theme="dark"] {
  --bg-primary: #1f2937;
  --text-primary: #f9fafb;
  --border-color: #374151;
}

.themed-element {
  background-color: var(--bg-primary);
  color: var(--text-primary);
  border-color: var(--border-color);
}
```

### Performance Best Practices

**Optimize for loading and rendering performance:**
```css
/* Good - Efficient selectors */
.component-class {
  /* Avoid deeply nested selectors */
}

/* Avoid - Inefficient selectors */
.container .sidebar .menu ul li a {
  /* Too specific and slow */
}

/* Good - CSS containment for performance */
.independent-component {
  contain: layout style paint;
}

/* Good - Optimize animations */
.smooth-animation {
  will-change: transform; /* Only when animating */
  transform: translateZ(0); /* Force hardware acceleration */
}

/* Remove will-change after animation */
.animation-complete {
  will-change: auto;
}
```

### File Organization

**Structure CSS files logically:**
```
styles/
├── globals.css          # Global styles and Tailwind imports
├── components/          # Component-specific styles
│   ├── Button.css
│   ├── Card.css
│   └── Modal.css
├── pages/              # Page-specific styles
│   ├── Dashboard.css
│   └── Profile.css
├── utilities/          # Custom utility classes
│   ├── animations.css
│   └── helpers.css
└── themes/             # Theme variations
    ├── dark.css
    └── light.css
```

### Naming Conventions

**Use consistent class naming:**
```css
/* Good - BEM methodology for custom components */
.user-profile {
  /* Block */
}

.user-profile__avatar {
  /* Element */
}

.user-profile__avatar--large {
  /* Modifier */
}

/* Good - Descriptive utility classes */
.sr-only {
  /* Screen reader only */
  @apply absolute w-px h-px p-0 -m-px overflow-hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.truncate-2-lines {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
```

### Tailwind Configuration

**Customize Tailwind for project needs:**
```javascript
// tailwind.config.js
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './public/index.html',
  ],
  darkMode: 'class', // or 'media'
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          900: '#1e3a8a',
        },
        brand: {
          light: '#60a5fa',
          DEFAULT: '#3b82f6',
          dark: '#2563eb',
        },
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
};
```