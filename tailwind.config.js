const { colors, background, fonts } = require('./src/constants/tokens.cjs');

module.exports = {
  content: ['./App.tsx', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        accent: colors.accent,
        danger: colors.danger,
        primary: colors.textPrimary,
        secondary: colors.textSecondary,
        tertiary: colors.textTertiary,
        background: background,
      },
      fontFamily: {
        display: [fonts.display],
        'display-medium': [fonts.displayMedium],
        body: [fonts.body],
        'body-medium': [fonts.bodyMedium],
        'body-bold': [fonts.bodyBold],
      },
    },
  },
  plugins: [],
};
