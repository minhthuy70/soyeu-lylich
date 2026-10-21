# Component Documentation

## Overview
This document describes the reusable React components used in the Sơ yếu lý lịch application.

## Components

### ProfilePage
**Location:** `frontend/src/components/ProfilePage.jsx`

Main profile page component with navigation tabs for different profile sections.

**Props:**
- None

**Features:**
- Navigation sidebar with section buttons
- Dynamic content rendering based on active section
- Integration with all profile-related components
- Theme-aware styling

**Usage:**
```jsx
<ProfilePage />
```

### AnalyticsDashboard
**Location:** `frontend/src/components/AnalyticsDashboard.jsx`

Comprehensive analytics dashboard with 6 main tabs.

**Props:**
- None

**Features:**
- Overview tab: Stats cards, event types, top pages
- User Behavior tab: Event history table
- Sessions tab: Session list with device info
- Funnel Analysis tab: Create/view funnels
- A/B Testing tab: Create/view A/B tests
- Retention tab: Retention metrics with charts

**Usage:**
```jsx
<AnalyticsDashboard />
```

### IntegrationsPage
**Location:** `frontend/src/components/IntegrationsPage.jsx`

Manage third-party integrations (Twitter, Slack, Notion, etc.).

**Props:**
- None

**Features:**
- List of available integrations
- OAuth flow for social providers
- API key configuration for services
- Connected integrations display
- Connect/disconnect functionality

**Usage:**
```jsx
<IntegrationsPage />
```

### Modal
**Location:** `frontend/src/components/Modal.jsx`

Reusable modal dialog component with accessibility features.

**Props:**
- `isOpen` (boolean): Whether modal is open
- `onClose` (function): Callback when modal closes
- `title` (string): Modal title
- `children` (node): Modal content
- `size` (string): 'small' | 'medium' | 'large' | 'fullscreen'

**Features:**
- 4 size variants
- Backdrop click to close
- Escape key to close
- Focus trap (uses useFocusTrap hook)
- ARIA attributes (role="dialog", aria-modal)
- Body scroll prevention
- Smooth animation

**Usage:**
```jsx
<Modal isOpen={isOpen} onClose={handleClose} title="Dialog Title" size="medium">
  <p>Modal content here</p>
</Modal>
```

### ConfirmDialog
**Location:** `frontend/src/components/ConfirmDialog.jsx`

Confirmation dialog for destructive actions.

**Props:**
- `isOpen` (boolean): Whether dialog is open
- `onClose` (function): Callback when dialog closes
- `onConfirm` (function): Callback when confirmed
- `title` (string): Dialog title
- `message` (string): Confirmation message
- `confirmText` (string): Confirm button text (default: "Confirm")
- `cancelText` (string): Cancel button text (default: "Cancel")
- `variant` (string): 'danger' | 'warning' | 'info'

**Features:**
- 3 color variants for different severity levels
- Wraps Modal component
- Keyboard accessible

**Usage:**
```jsx
<ConfirmDialog
  isOpen={showConfirm}
  onClose={() => setShowConfirm(false)}
  onConfirm={handleDelete}
  title="Delete Item"
  message="Are you sure you want to delete this item?"
  variant="danger"
/>
```

### ProgressBar
**Location:** `frontend/src/components/ProgressBar.jsx`

Progress bar component for visual feedback.

**Props:**
- `progress` (number): Progress percentage (0-100)
- `size` (string): 'small' | 'medium' | 'large'
- `color` (string): 'blue' | 'green' | 'red' | 'yellow'
- `showLabel` (boolean): Show percentage label

**Features:**
- 3 size variants
- 4 color options
- Optional percentage label
- Smooth progress animation
- Clamped values (0-100%)

**Usage:**
```jsx
<ProgressBar progress={75} size="medium" color="blue" showLabel={true} />
```

### Tooltip
**Location:** `frontend/src/components/Tooltip.jsx`

Tooltip component for contextual information.

**Props:**
- `children` (node): Element to show tooltip on
- `content` (string): Tooltip text
- `position` (string): 'top' | 'bottom' | 'left' | 'right'
- `delay` (number): Delay before showing (ms, default: 200)

**Features:**
- 4 position options
- Configurable delay
- Smooth fade-in animation
- Auto positioning

**Usage:**
```jsx
<Tooltip content="Tooltip text" position="top">
  Hover over me
</Tooltip>
```

### LazyLoad
**Location:** `frontend/src/components/LazyLoad.jsx`

Lazy loading component for performance optimization.

**Props:**
- `children` (node): Content to lazy load
- `threshold` (number): Intersection Observer threshold (default: 0.1)
- `rootMargin` (string): Root margin for observer
- `fallback` (node): Fallback content while loading

**Features:**
- Intersection Observer API
- Configurable threshold and root margin
- Smooth fade-in transition
- Fallback content support

**Usage:**
```jsx
<LazyLoad threshold={0.2}>
  <HeavyComponent />
</LazyLoad>
```

### OptimizedImage
**Location:** `frontend/src/components/OptimizedImage.jsx`

Optimized image component with responsive srcset.

**Props:**
- `src` (string): Image source
- `alt` (string): Alt text (required)
- `className` (string): CSS class
- `sizes` (string): Sizes attribute
- `loading` (string): 'lazy' | 'eager'

**Features:**
- Responsive srcset generation
- Lazy loading by default
- Async decoding
- Fade-in transition
- Error handling

**Usage:**
```jsx
<OptimizedImage src="/image.jpg" alt="Description" sizes="(max-width: 768px) 100vw, 50vw" />
```

### FormWizard
**Location:** `frontend/src/components/FormWizard.jsx`

Multi-step form wizard with progress tracking.

**Props:**
- `steps` (array): Array of step objects
  - `title` (string): Step title
  - `label` (string): Step label
  - `component` (React component): Step component
- `onComplete` (function): Callback when wizard completes

**Features:**
- Visual progress indicators
- Step-by-step navigation
- Form data management
- Previous/Next buttons
- Auto-complete on final step

**Usage:**
```jsx
<FormWizard
  steps={[
    { title: 'Step 1', label: 'Personal Info', component: Step1 },
    { title: 'Step 2', label: 'Contact Info', component: Step2 },
  ]}
  onComplete={handleComplete}
/>
```

### DragDrop
**Location:** `frontend/src/components/DragDrop.jsx`

File upload zone with drag and drop support.

**Props:**
- `children` (node): Drop zone content
- `onDrop` (function): Callback when files dropped
- `onDragOver` (function): Callback on drag over
- `accept` (array): Accepted file extensions

**Features:**
- Drag and drop file upload
- File filtering by extension
- Visual drag overlay
- Multiple file support

**Usage:**
```jsx
<DragDrop onDrop={handleDrop} accept={['jpg', 'png']}>
  <p>Drop files here</p>
</DragDrop>
```

### ContextMenu
**Location:** `frontend/src/components/ContextMenu.jsx`

Right-click context menu component.

**Props:**
- `items` (array): Menu items
  - `label` (string): Item label
  - `icon` (string): Icon emoji
  - `onClick` (function): Click callback
  - `shortcut` (string): Keyboard shortcut
  - `divider` (boolean): Add divider
  - `danger` (boolean): Danger styling
- `onClose` (function): Callback when menu closes
- `position` (object): { x, y } coordinates

**Features:**
- Custom menu items
- Icons and shortcuts
- Dividers
- Danger styling
- Click outside to close
- Escape key to close

**Usage:**
```jsx
<ContextMenu
  items={[
    { label: 'Edit', icon: '✏️', onClick: handleEdit },
    { label: 'Delete', icon: '🗑️', onClick: handleDelete, danger: true },
  ]}
  position={{ x: 100, y: 100 }}
  onClose={handleClose}
/>
```

### Accessible Components

#### AccessibleButton
**Location:** `frontend/src/components/AccessibleComponents.jsx`

Button with aria-label support.

#### AccessibleIcon
Icon with role='img' and label.

#### AccessibleLink
Link with aria-label.

#### LiveRegion
ARIA live region for dynamic content.

### Semantic HTML Components
**Location:** `frontend/src/components/SemanticHTML.jsx`

Semantic HTML components for accessibility:
- `Main`: <main role="main">
- `Navigation`: <nav> with aria-label
- `Header`: <header role="banner">
- `Footer`: <footer role="contentinfo">
- `Section`: <section> with aria-label
- `Article`: <article> with aria-label
- `Aside`: <aside> with aria-label
- `Heading`: Dynamic h1-h6

## Hooks

### useAutoSave
**Location:** `frontend/src/hooks/useAutoSave.js`

Debounced auto-save hook.

**Usage:**
```jsx
const [data, setData] = useState(initialData);
useAutoSave(data, onSave);
```

### useDebounce
**Location:** `frontend/src/hooks/useDebounce.js`

Debounce value changes and function calls.

**Usage:**
```jsx
const debouncedValue = useDebounce(value, 500);
const debouncedCallback = useDebouncedCallback(callback, 500);
```

### useKeyboardShortcuts
**Location:** `frontend/src/hooks/useKeyboardShortcuts.js`

Keyboard shortcuts hook with modifier support.

**Usage:**
```jsx
useKeyboardShortcuts([
  { key: 's', ctrl: true, callback: handleSave },
  { key: 'Escape', callback: handleCancel },
]);
```

### useAccessibility
**Location:** `frontend/src/hooks/useAccessibility.js`

Accessibility hooks for keyboard navigation and focus trap.

**Usage:**
```jsx
const modalRef = useFocusTrap(isOpen);
useKeyboardNavigation(onKeyDown);
```

### useWebVitals
**Location:** `frontend/src/hooks/useWebVitals.js`

Core Web Vitals monitoring hook.

**Usage:**
```jsx
useWebVitals(); // Automatically tracks LCP, FID, CLS, FCP
```

## Styling

All components include corresponding CSS files with:
- Consistent naming convention
- Responsive design
- Theme support (light/dark)
- Accessibility focus states
