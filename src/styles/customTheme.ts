import { theme, extendTheme } from "@chakra-ui/react";

const customTheme = extendTheme({
  ...theme,
  fonts: {
    ...theme.fonts,
    body: "Jost, sans-serif",
    heading: "Jost, sans-serif",
  },
});

export default customTheme;
