import React from 'react';

export function AccessibleButton({ children, ...props }) {
  return (
    <button
      {...props}
      aria-label={props['aria-label'] || props.title}
      type={props.type || 'button'}
    >
      {children}
    </button>
  );
}

export function AccessibleIcon({ icon, label, title }) {
  return (
    <span role="img" aria-label={label} title={title || label}>
      {icon}
    </span>
  );
}

export function AccessibleLink({ children, href, ariaLabel, ...props }) {
  return (
    <a
      href={href}
      aria-label={ariaLabel}
      {...props}
    >
      {children}
    </a>
  );
}

export function LiveRegion({ children, ariaLive = 'polite', ariaAtomic = false }) {
  return (
    <div
      role="status"
      aria-live={ariaLive}
      aria-atomic={ariaAtomic}
      className="sr-only"
    >
      {children}
    </div>
  );
}

export function AriaDescription({ id, children }) {
  return (
    <span id={id} className="sr-only">
      {children}
    </span>
  );
}
