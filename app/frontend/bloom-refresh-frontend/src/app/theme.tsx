import { defineConfig } from "@chakra-ui/react";

export const customConfig = defineConfig({
  // top-level `globalCss` replaces `theme.styles.global`
  globalCss: {
    body: {
      bg: "gray.50",
      color: "gray.800",
    },
  },
  // you can still customize CSS-var root/prefix here if you like
  // cssVarsRoot: ":where(:root, :host)",
  // cssVarsPrefix: "ck",
});
