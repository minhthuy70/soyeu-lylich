import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Compatibility shim: allow tests using jest globals to run in vitest
if (typeof globalThis.jest === 'undefined') {
  globalThis.jest = vi;
}
