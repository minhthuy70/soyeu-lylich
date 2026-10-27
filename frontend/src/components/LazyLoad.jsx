import React, { useState, useEffect, useRef } from 'react';

export default function LazyLoad({ children, threshold = 0.1, rootMargin = '0px', fallback = null }) {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const elementRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  useEffect(() => {
    if (isVisible && !isLoaded) {
      // Simulate loading delay for smooth transition
      const timer = setTimeout(() => setIsLoaded(true), 100);
      return () => clearTimeout(timer);
    }
  }, [isVisible, isLoaded]);

  return (
    <div ref={elementRef} style={{ minHeight: '100px' }}>
      {isVisible ? children : fallback}
    </div>
  );
}

export function LazyImage({ src, alt, className, loading = 'lazy', ...props }) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading={loading}
      onLoad={() => setIsLoaded(true)}
      style={{
        opacity: isLoaded ? 1 : 0,
        transition: 'opacity 0.3s ease-in',
        ...props.style,
      }}
      {...props}
    />
  );
}
