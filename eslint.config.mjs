import js from "@eslint/js";
import plugin from "./index.js";

export default [
  js.configs.recommended,
  {
    files: ["**/*.js"],
    languageOptions: {
      sourceType: "commonjs",
      ecmaVersion: "latest",
    },
    plugins: {
      "no-only-tests": plugin,
    },
    rules: {
      "no-only-tests/no-only-tests": "error",
    },
  },
  {
    files: ["**/*.mjs"],
    languageOptions: {
      sourceType: "module",
      ecmaVersion: "latest",
    },
    plugins: {
      "no-only-tests": plugin,
    },
    rules: {
      "no-only-tests/no-only-tests": "error",
    },
  },
];
