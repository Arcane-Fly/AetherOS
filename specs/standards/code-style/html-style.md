# HTML Style Guide

## HTML Standards for AetherOS React Components

### Semantic HTML

**Use semantic elements for better accessibility and SEO:**
```html
<!-- Good - Semantic structure -->
<main className="dashboard">
  <header className="dashboard-header">
    <h1>AetherOS Dashboard</h1>
    <nav aria-label="Main navigation">
      <ul>
        <li><a href="/projects">Projects</a></li>
        <li><a href="/history">History</a></li>
      </ul>
    </nav>
  </header>
  
  <section className="content">
    <article className="generation-panel">
      <h2>Code Generation</h2>
      <p>Generate code, APIs, and UIs using natural language.</p>
    </article>
    
    <aside className="sidebar">
      <h3>Recent Creations</h3>
      <!-- Sidebar content -->
    </aside>
  </section>
</main>

<!-- Avoid - Non-semantic structure -->
<div className="dashboard">
  <div className="header">
    <div className="title">AetherOS Dashboard</div>
    <div className="nav">
      <!-- Navigation -->
    </div>
  </div>
</div>
```

### Accessibility Attributes

**Include proper ARIA attributes and accessibility features:**
```jsx
// Good - Accessible form components
<form onSubmit={handleSubmit} noValidate>
  <div className="form-group">
    <label htmlFor="prompt-input" className="form-label">
      Code Generation Prompt
    </label>
    <textarea
      id="prompt-input"
      className="form-control"
      placeholder="Describe what you want to create..."
      value={prompt}
      onChange={(e) => setPrompt(e.target.value)}
      aria-describedby="prompt-help"
      aria-required="true"
      rows={4}
    />
    <div id="prompt-help" className="form-help">
      Be specific about the functionality you need.
    </div>
    {error && (
      <div className="form-error" role="alert" aria-live="polite">
        {error}
      </div>
    )}
  </div>
  
  <button
    type="submit"
    disabled={isLoading}
    aria-describedby="submit-status"
  >
    {isLoading ? 'Generating...' : 'Generate Code'}
  </button>
  
  <div id="submit-status" className="sr-only" aria-live="polite">
    {isLoading ? 'Generation in progress' : ''}
  </div>
</form>

// Good - Accessible modal
<dialog
  open={isOpen}
  onClose={onClose}
  aria-labelledby="modal-title"
  aria-describedby="modal-description"
  role="dialog"
  aria-modal="true"
>
  <div className="modal-content">
    <header className="modal-header">
      <h2 id="modal-title">Confirm Deletion</h2>
      <button
        type="button"
        onClick={onClose}
        aria-label="Close dialog"
        className="modal-close"
      >
        ×
      </button>
    </header>
    
    <div id="modal-description" className="modal-body">
      Are you sure you want to delete this creation?
    </div>
    
    <footer className="modal-footer">
      <button type="button" onClick={onCancel}>
        Cancel
      </button>
      <button type="button" onClick={onConfirm} className="btn-danger">
        Delete
      </button>
    </footer>
  </div>
</dialog>
```

### Form Best Practices

**Create accessible and user-friendly forms:**
```jsx
// Good - Comprehensive form structure
const AuthForm = ({ type }) => {
  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <fieldset>
        <legend className="sr-only">
          {type === 'login' ? 'Sign In' : 'Create Account'}
        </legend>
        
        <div className="form-group">
          <label htmlFor="email" className="required">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            autoComplete="email"
            required
            aria-invalid={errors.email ? 'true' : 'false'}
            aria-describedby={errors.email ? 'email-error' : undefined}
          />
          {errors.email && (
            <div id="email-error" className="error-message" role="alert">
              {errors.email}
            </div>
          )}
        </div>
        
        <div className="form-group">
          <label htmlFor="password" className="required">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            autoComplete={type === 'login' ? 'current-password' : 'new-password'}
            required
            minLength={8}
            aria-describedby="password-help"
          />
          <div id="password-help" className="form-help">
            Minimum 8 characters required
          </div>
        </div>
        
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Processing...' : (type === 'login' ? 'Sign In' : 'Create Account')}
        </button>
      </fieldset>
    </form>
  );
};
```

### Image and Media Guidelines

**Optimize images and provide proper alternatives:**
```jsx
// Good - Responsive images with proper alt text
<figure className="user-avatar">
  <img
    src={user.avatar}
    alt={`${user.name}'s profile picture`}
    width={64}
    height={64}
    loading="lazy"
    className="avatar-image"
  />
  <figcaption className="sr-only">
    Profile picture for {user.name}
  </figcaption>
</figure>

// Good - Code preview with syntax highlighting
<pre className="code-preview" tabIndex="0" role="region" aria-label="Generated code">
  <code className="language-javascript">
    {generatedCode}
  </code>
</pre>

// Good - Video with captions and controls
<video
  controls
  preload="metadata"
  className="tutorial-video"
  aria-describedby="video-description"
>
  <source src="/tutorials/intro.mp4" type="video/mp4" />
  <track
    kind="captions"
    src="/tutorials/intro-captions.vtt"
    srcLang="en"
    label="English captions"
    default
  />
  Your browser does not support the video tag.
</video>
<div id="video-description" className="video-description">
  Introduction to AetherOS code generation features
</div>
```

### Data Tables

**Create accessible and responsive tables:**
```jsx
// Good - Accessible data table
<div className="table-container">
  <table className="data-table" role="table">
    <caption className="table-caption">
      Recent Code Generations
      <span className="table-summary">
        Showing {results.length} of {total} generations
      </span>
    </caption>
    
    <thead>
      <tr>
        <th scope="col" id="name-header">
          <button
            type="button"
            onClick={() => handleSort('name')}
            aria-describedby="sort-help"
          >
            Name
            {sortField === 'name' && (
              <span aria-label={sortDirection === 'asc' ? 'sorted ascending' : 'sorted descending'}>
                {sortDirection === 'asc' ? '↑' : '↓'}
              </span>
            )}
          </button>
        </th>
        <th scope="col" id="date-header">Created</th>
        <th scope="col" id="language-header">Language</th>
        <th scope="col" id="actions-header">Actions</th>
      </tr>
    </thead>
    
    <tbody>
      {generations.map((generation) => (
        <tr key={generation.id}>
          <td headers="name-header">
            <a href={`/generation/${generation.id}`}>
              {generation.name}
            </a>
          </td>
          <td headers="date-header">
            <time dateTime={generation.createdAt}>
              {formatDate(generation.createdAt)}
            </time>
          </td>
          <td headers="language-header">
            <span className="language-badge">
              {generation.language}
            </span>
          </td>
          <td headers="actions-header">
            <button
              type="button"
              onClick={() => handleDelete(generation.id)}
              aria-label={`Delete ${generation.name}`}
              className="btn-danger"
            >
              Delete
            </button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>

<div id="sort-help" className="sr-only">
  Click column headers to sort the table
</div>
```

### Navigation Patterns

**Implement accessible navigation:**
```jsx
// Good - Main navigation with skip links
<div className="app-container">
  <a href="#main-content" className="skip-link">
    Skip to main content
  </a>
  
  <header className="app-header">
    <nav className="main-nav" aria-label="Main navigation">
      <div className="nav-brand">
        <a href="/" aria-label="AetherOS home">
          <img src="/logo.svg" alt="AetherOS" width={120} height={40} />
        </a>
      </div>
      
      <ul className="nav-menu">
        <li>
          <a 
            href="/dashboard" 
            aria-current={currentPage === 'dashboard' ? 'page' : undefined}
          >
            Dashboard
          </a>
        </li>
        <li>
          <a 
            href="/generations" 
            aria-current={currentPage === 'generations' ? 'page' : undefined}
          >
            My Generations
          </a>
        </li>
      </ul>
      
      <div className="nav-user">
        <button
          type="button"
          aria-expanded={isMenuOpen}
          aria-haspopup="menu"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {user.name}
        </button>
        
        {isMenuOpen && (
          <ul className="user-menu" role="menu">
            <li role="menuitem">
              <a href="/profile">Profile</a>
            </li>
            <li role="menuitem">
              <button type="button" onClick={handleLogout}>
                Sign Out
              </button>
            </li>
          </ul>
        )}
      </div>
    </nav>
  </header>
  
  <main id="main-content" className="app-main">
    {/* Main content */}
  </main>
</div>

// Good - Breadcrumb navigation
<nav aria-label="Breadcrumb" className="breadcrumb">
  <ol>
    <li>
      <a href="/">Home</a>
    </li>
    <li>
      <a href="/projects">Projects</a>
    </li>
    <li aria-current="page">
      Code Generator
    </li>
  </ol>
</nav>
```

### Error and Status Messages

**Provide clear feedback to users:**
```jsx
// Good - Error states with proper ARIA
const ErrorMessage = ({ error, onRetry }) => (
  <div className="error-container" role="alert" aria-live="assertive">
    <div className="error-icon" aria-hidden="true">⚠️</div>
    <div className="error-content">
      <h3>Something went wrong</h3>
      <p>{error.message}</p>
      {onRetry && (
        <button type="button" onClick={onRetry} className="retry-button">
          Try Again
        </button>
      )}
    </div>
  </div>
);

// Good - Success notifications
const SuccessMessage = ({ message, onDismiss }) => (
  <div 
    className="success-notification" 
    role="status" 
    aria-live="polite"
    aria-atomic="true"
  >
    <div className="success-icon" aria-hidden="true">✅</div>
    <span>{message}</span>
    <button
      type="button"
      onClick={onDismiss}
      aria-label="Dismiss notification"
      className="dismiss-button"
    >
      ×
    </button>
  </div>
);

// Good - Loading states
const LoadingSpinner = ({ label = "Loading..." }) => (
  <div className="loading-container">
    <div 
      className="spinner" 
      role="progressbar" 
      aria-label={label}
      aria-valuetext={label}
    />
    <span className="sr-only">{label}</span>
  </div>
);
```