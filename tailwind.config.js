/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}", // Vue 파일 감지
  ],
  theme: {
    extend: {
      colors: {
        gray: {
          50: '#F9FAFB',
          100: '#F3F4F6',
          200: '#E5E7EB',
          300: '#D1D5DB',
          400: '#9CA3AF',
          500: '#6B7280',
          600: '#4B5563',
          700: '#374151',
          800: '#1F2937',
          900: '#111827',
        },
        primary: {
          DEFAULT: '#60A5FA', // blue-400
          light: '#93C5FD',  // blue-300
          dark: '#3B82F6',   // blue-500
        },
        accent: {
          DEFAULT: '#D1FAE5', // emerald-100, a very soft green
        },
        'text-base': '#374151', // gray-700
        'text-muted': '#6B7280', // gray-500
        'text-heading': '#111827', // gray-900
        'bg-default': '#F9FAFB', // gray-50
        'bg-paper': '#FFFFFF',   // white
      },
      borderRadius: {
        'sm': '0.125rem',
        'md': '0.375rem', // Slightly more than default 'rounded'
        'lg': '0.5rem',
        'xl': '0.75rem',
        'base': '0.25rem', // Same as default 'rounded'
        'card': '0.375rem', // Custom for card elements
      },
      boxShadow: {
        'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'md': '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
        'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.025)',
        'subtle': '0px 1px 3px rgba(0, 0, 0, 0.06)', // Custom very subtle shadow
      },
      spacing: {
        '0.5': '0.125rem', // 2px
        '1': '0.25rem',   // 4px
        '1.5': '0.375rem', // 6px
        '2': '0.5rem',    // 8px
        '2.5': '0.625rem', // 10px
        '3': '0.75rem',   // 12px
        '3.5': '0.875rem', // 14px
        '4': '1rem',      // 16px
        '5': '1.25rem',   // 20px
        '6': '1.5rem',    // 24px
        '7': '1.75rem',   // 28px
        '8': '2rem',      // 32px
        '9': '2.25rem',   // 36px
        '10': '2.5rem',   // 40px
        '11': '2.75rem',  // 44px
        '12': '3rem',     // 48px
        '14': '3.5rem',   // 56px (for header height)
        '16': '4rem',     // 64px
        '20': '5rem',     // 80px
        '24': '6rem',     // 96px
        '28': '7rem',     // 112px
        '32': '8rem',     // 128px
        '36': '9rem',     // 144px
        '40': '10rem',    // 160px
        '44': '11rem',    // 176px
        '48': '12rem',    // 192px
        '52': '13rem',    // 208px
        '56': '14rem',    // 224px
        '60': '15rem',    // 240px
        '64': '16rem',    // 256px
        '72': '18rem',    // 288px
        '80': '20rem',    // 320px
        '96': '24rem',    // 384px
      }
    },
  },
  plugins: [],
}