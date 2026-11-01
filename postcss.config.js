module.exports = {
  plugins: {
    // Swiper 12 ships native CSS nesting: flatten it for older browsers
    // (must run before Tailwind).
    "tailwindcss/nesting": {},
    tailwindcss: {},
    autoprefixer: {},
  },
}
