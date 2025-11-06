import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint, { config } from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
// import tailwindcss from "eslint-plugin-tailwindcss";
import tanstackQuery from "@tanstack/eslint-plugin-query";
import tanstackRouter from "@tanstack/eslint-plugin-router";
import jsxA11y from "eslint-plugin-jsx-a11y";
import prettierConfig from "eslint-config-prettier";

export default tseslint.config(
  {
    ignores: ["dist/**", "node_modules/**"],
  },
  {
    // Global settings for all files
    files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },
    settings: {
      react: {
        version: "detect",
      },
      tailwindcss: {
        config: "./tailwind.config.js",
        callees: ["cn", "cva"],
      },
    },
  },
  // Base configs
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  // Plugin configs
  pluginReact.configs.flat.recommended,
  jsxA11y.flatConfigs.recommended,
  // ...tailwindcss.configs["flat/recommended"],
  tanstackQuery.configs["flat/recommended"],
  tanstackRouter.configs["flat/recommended"],
  // Custom rules
  {
    rules: {
      "react/react-in-jsx-scope": "off",
    },
  },
  prettierConfig,
);
