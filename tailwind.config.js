/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        surface: 'rgb(var(--surface) / <alpha-value>)',
        'surface-2': 'rgb(var(--surface-2) / <alpha-value>)',
        'surface-3': 'rgb(var(--surface-3) / <alpha-value>)',
        content: 'rgb(var(--content) / <alpha-value>)',
        'content-muted': 'rgb(var(--content-muted) / <alpha-value>)',
        'content-faint': 'rgb(var(--content-faint) / <alpha-value>)',
        border: 'rgb(var(--border) / <alpha-value>)',
        'border-strong': 'rgb(var(--border-strong) / <alpha-value>)',
        accent: 'rgb(var(--accent) / <alpha-value>)',
        'accent-2': 'rgb(var(--accent-2) / <alpha-value>)',
        action: 'rgb(var(--action) / <alpha-value>)',
        glass: 'var(--glass)',
        'glass-hover': 'var(--glass-hover)',
        wire: {
          model: 'rgb(var(--wire-model) / <alpha-value>)',
          clip: 'rgb(var(--wire-clip) / <alpha-value>)',
          vae: 'rgb(var(--wire-vae) / <alpha-value>)',
          conditioning: 'rgb(var(--wire-conditioning) / <alpha-value>)',
          latent: 'rgb(var(--wire-latent) / <alpha-value>)',
          image: 'rgb(var(--wire-image) / <alpha-value>)',
          video: 'rgb(var(--wire-video) / <alpha-value>)',
          mesh: 'rgb(var(--wire-mesh) / <alpha-value>)',
          neutral: 'rgb(var(--wire-neutral) / <alpha-value>)',
        },
      },
    },
  },
  plugins: [],
};