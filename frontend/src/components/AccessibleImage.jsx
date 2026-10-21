import React from 'react';

export default function AccessibleImage({ src, alt, className, ...props }) {
  if (!alt) {
    console.warn('AccessibleImage: alt text is required for accessibility');
  }

  return (
    <img
      src={src}
      alt={alt || ''}
      className={className}
      loading="lazy"
      {...props}
    />
  );
}

export function DecorativeImage({ src, className, ...props }) {
  return (
    <img
      src={src}
      alt=""
      role="presentation"
      className={className}
      loading="lazy"
      {...props}
    />
  );
}
