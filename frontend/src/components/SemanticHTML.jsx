import React from 'react';

export function Main({ children, ...props }) {
  return <main role="main" {...props}>{children}</main>;
}

export function Navigation({ children, label, ...props }) {
  return (
    <nav aria-label={label || 'Main navigation'} {...props}>
      {children}
    </nav>
  );
}

export function Header({ children, ...props }) {
  return <header role="banner" {...props}>{children}</header>;
}

export function Footer({ children, ...props }) {
  return <footer role="contentinfo" {...props}>{children}</footer>;
}

export function Section({ children, ariaLabel, ...props }) {
  return (
    <section aria-label={ariaLabel} {...props}>
      {children}
    </section>
  );
}

export function Article({ children, ariaLabel, ...props }) {
  return (
    <article aria-label={ariaLabel} {...props}>
      {children}
    </article>
  );
}

export function Aside({ children, ariaLabel, ...props }) {
  return (
    <aside aria-label={ariaLabel || 'Sidebar'} {...props}>
      {children}
    </aside>
  );
}

export function Heading({ level = 1, children, ...props }) {
  const Tag = `h${level}`;
  return <Tag {...props}>{children}</Tag>;
}
