import js from "@eslint/js";
import tseslint from "typescript-eslint";

export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["**/*.ts"],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: "./tsconfig.json",
      },
      globals: {
        require: "readonly",
        exports: "readonly",
        console: "readonly",
      },
    },
    rules: {
      "@typescript-eslint/no-require-imports": "off", // allow require()
    },
  },
];

export const ignores = [
  "build/",
  "dist/",
  "node_modules/",
  "spec/helpers/", // optional: only if you don’t want to lint helpers
];
