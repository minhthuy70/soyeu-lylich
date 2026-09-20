/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#075985',
          hover: '#0c4a6e',
          dark: '#042f3f',
          light: '#e0f2fe',
        },
        gold: {
          DEFAULT: '#facc15',
          hover: '#eab308',
          dark: '#ca8a04',
          light: '#fef9c3',
        },
        red: {
          DEFAULT: '#dc2626',
          hover: '#b91c1c',
          dark: '#991b1b',
          light: '#fee2e2',
        },
        blue: {
          DEFAULT: '#0ea5e9',
        },
        background: '#f8fafc',
        surface: '#ffffff',
        'surface-alt': '#f1f5f9',
        'text-primary': '#0f172a',
        'text-secondary': '#334155',
        'text-muted': '#64748b',
        'text-disabled': '#94a3b8',
        border: '#e2e8f0',
        'border-strong': '#cbd5e1',
        'border-focus': '#075985',
        success: '#16a34a',
        'success-light': '#dcfce7',
        warning: '#d97706',
        'warning-light': '#fef3c7',
        error: '#dc2626',
        'error-light': '#fee2e2',
        info: '#0284c7',
        'info-light': '#e0f2fe',
      },
      borderRadius: {
        sm: '8px',
        md: '12px',
        lg: '16px',
        xl: '20px',
      },
    },
  },
  plugins: [],
}
