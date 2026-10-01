const { colors, background, glow, stat, fonts, fontSize, tracking, radius } = require('./src/constants/tokens.cjs');

const px = (scale) => Object.fromEntries(Object.entries(scale).map(([k, v]) => [k, `${v}px`]));

module.exports = {
  content: ['./App.tsx', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        accent: colors.accent,
        danger: colors.danger,
        white: colors.white,
        ink: colors.ink,
        primary: colors.textPrimary,
        secondary: colors.textSecondary,
        tertiary: colors.textTertiary,
        muted: colors.textMuted,
        hint: colors.textHint,
        disabled: colors.textDisabled,
        background,
        glow,
        stat,
      },
      fontFamily: {
        display: [fonts.display],
        'display-italic': [fonts.displayItalic],
        'display-medium': [fonts.displayMedium],
        body: [fonts.body],
        'body-italic': [fonts.bodyItalic],
        'body-medium': [fonts.bodyMedium],
        'body-bold': [fonts.bodyBold],
      },
      fontSize: px(fontSize),
      letterSpacing: px(tracking),
      borderRadius: px(radius),
    },
  },
  plugins: [],
};
