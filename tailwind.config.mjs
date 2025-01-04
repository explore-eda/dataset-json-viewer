/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        'custom-beige': '#e0d4cc',
        'custom-beige-dark': '#d3c6be',
        'custom-blue': '#0c2470',
        'custom-gray': '#333',
      },
    },
  },
  plugins: [],
};
