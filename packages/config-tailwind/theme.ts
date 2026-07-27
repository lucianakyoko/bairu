import colors from "tailwindcss/colors";

export const palette = {
  primary: colors.teal,

  neutral: colors.slate,

  success: colors.emerald,

  warning: colors.amber,

  danger: colors.red,

  info: colors.sky,
};

export const tokens = {
  primary: palette.primary[600],
  primaryForeground: colors.white,

  secondary: palette.neutral[700],
  secondaryForeground: colors.white,

  background: palette.neutral[50],
  surface: colors.white,

  text: palette.neutral[900],
  textMuted: palette.neutral[500],

  border: palette.neutral[200],

  success: palette.success[600],
  warning: palette.warning[500],
  danger: palette.danger[600],
  info: palette.info[600],
};

const theme = {
  colors: {
    palette,
    tokens,
  },

  typography: {
    display: {},

    heading: {},

    title: {},

    subtitle: {},

    body: {},

    bodySmall: {},

    caption: {},

    label: {},

    button: {},
  },

  borderRadius: {
    sm: "0.125rem",
    md: "0.375rem",
    lg: "0.5rem",
    xl: "0.75rem",
    full: "9999px",
  },

  shadows: {
    sm: "",
    md: "",
    lg: "",
  },
};

export default theme;
