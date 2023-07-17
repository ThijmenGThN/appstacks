
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  plugins: [require('@tailwindcss/forms')],
  theme: {
    extend: {
      colors: {
        "primary": '#11999e',
        "primary-dark": '#0e7d81'
      }
    }
  }
}
