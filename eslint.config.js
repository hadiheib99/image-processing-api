import js from "@eslint/js";
import tseslint from "typescript-eslint";

export default [
  { ignores: ["build/**", "dist/**", "spec/helpers/**", "src/**/*.js"] }, // ignore JS files
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["**/*.ts"],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: { project: "./tsconfig.json" },
      sourceType: "module",
    },
    rules: {
      // optional quality-of-life
      "no-console": "off",
    },
  },
];
