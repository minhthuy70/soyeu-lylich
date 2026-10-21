import React, { useState, useRef } from 'react';

export default function OptimizedImage({ src, alt, className, sizes, ...props }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);
  const imgRef = useRef(null);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setError(true);
  };

  // Generate srcset for responsive images
  const generateSrcSet = (baseSrc) => {
    const widths = [320, 640, 768, 1024, 1280, 1536];
    return widths
      .map((width) => {
        const url = new URL(baseSrc, window.location.origin);
        url.searchParams.set('w', width);
        return `${url.toString()} ${width}w`;
      })
      .join(', ');
  };

  const srcSet = props.srcSet || generateSrcSet(src);
  const defaultSizes = sizes || '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw';

  if (error) {
    return (
      <div className={`image-error ${className || ''}`} {...props}>
        <span>Image failed to load</span>
      </div>
    );
  }

  return (
    <img
      ref={imgRef}
      src={src}
      srcSet={srcSet}
      sizes={defaultSizes}
      alt={alt}
      className={className}
      loading="lazy"
      decoding="async"
      onLoad={handleLoad}
      onError={handleError}
      style={{
        opacity: isLoaded ? 1 : 0,
        transition: 'opacity 0.3s ease-in',
        ...props.style,
      }}
      {...props}
    />
  );
}

export function Picture({ sources, fallback, alt, className, ...props }) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <picture>
      {sources.map((source, index) => (
        <source
          key={index}
          srcSet={source.srcSet}
          media={source.media}
          type={source.type}
        />
      ))}
      <img
        src={fallback}
        alt={alt}
        className={className}
        loading="lazy"
        decoding="async"
        onLoad={() => setIsLoaded(true)}
        style={{
          opacity: isLoaded ? 1 : 0,
          transition: 'opacity 0.3s ease-in',
          ...props.style,
        }}
        {...props}
      />
    </picture>
  );
}
