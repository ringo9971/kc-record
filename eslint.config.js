// eslint.config.js
import js from "@eslint/js";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import importPlugin from "eslint-plugin-import";
import reactPlugin from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";

export default [

  // --- ignore ---
  {
    ignores: ["dist", ".eslintrc.cjs"],
  },

  // --- main config ---
  {
    files: ["**/*.{js,jsx,ts,tsx}"],

    languageOptions: {
      parser: tsParser,

      // ★ env の代わりに globals に統合
      globals: {
        // browser
        window: "readonly",
        document: "readonly",
        navigator: "readonly",

        // ES2020
        BigInt: "readonly",

        // your custom globals
        Atomics: "readonly",
        SharedArrayBuffer: "readonly",
        React: "writable",
      },

      ecmaVersion: 2020,
      sourceType: "module",

      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },

    settings: {
      react: { version: "18.x" },
    },

    plugins: {
      "@typescript-eslint": tseslint,
      react: reactPlugin,
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      import: importPlugin,
    },

    rules: {
      ...js.configs.recommended.rules,
      ...tseslint.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      ...reactPlugin.configs.recommended.rules,

      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],

      "import/order": [
        "warn",
        {
          groups: [
            ["builtin", "external"],
            "internal",
            ["parent", "sibling", "index", "object", "type"],
          ],
          "newlines-between": "always",
          pathGroupsExcludedImportTypes: ["builtin"],
          alphabetize: { order: "asc", caseInsensitive: true },
          pathGroups: [
            { pattern: "src/types/**", group: "internal", position: "before" },
            {
              pattern: "src/repositories/**",
              group: "internal",
              position: "before",
            },
          ],
        },
      ],
    },
  },
];
