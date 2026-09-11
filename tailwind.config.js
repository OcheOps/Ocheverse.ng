/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        paper: 'var(--paper)',
        'paper-2': 'var(--paper-2)',
        ink: 'var(--ink)',
        'ink-soft': 'var(--ink-soft)',
        dust: 'var(--dust)',
        rule: 'var(--rule)',
        'rule-strong': 'var(--rule-strong)',
        'ed-blue': 'var(--blue)',
        'ed-blue-ink': 'var(--blue-ink)',
        'ed-green': 'var(--green)',
        'ed-green-live': 'var(--green-live)',
        'ed-red': 'var(--red)',
      },
      fontFamily: {
        editorial: ['Georgia', '"Iowan Old Style"', '"Hoefler Text"', '"Palatino Linotype"', '"Book Antiqua"', 'serif'],
        mono: ['ui-monospace', '"JetBrains Mono"', '"Cascadia Mono"', '"SF Mono"', '"Menlo"', '"Consolas"', 'monospace'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
