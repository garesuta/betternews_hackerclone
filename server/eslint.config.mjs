import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";
import drizzlePlugin from "eslint-plugin-drizzle";
import eslintPrettierConfig from "eslint-config-prettier";
import { fixupPluginRules } from "@eslint/compat";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
    plugins: { js },
    extends: ["js/recommended"],
  },
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
    languageOptions: { globals: globals.browser },
  },
  tseslint.configs.recommended,
  {
    plugins: {
      drizzle: fixupPluginRules(drizzlePlugin),
    },
  },
]);
