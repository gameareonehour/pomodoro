import js from "@eslint/js";
import tsParser from "@typescript-eslint/parser";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import eslintConfigPrettier from "eslint-config-prettier";
import globals from "globals";

const tsRules = {
  ...tsPlugin.configs["recommended"].rules,
  ...tsPlugin.configs["recommended-type-checked"].rules,
};

const reactRules = {
  ...reactPlugin.configs.recommended.rules,
  ...reactPlugin.configs["jsx-runtime"].rules,
};

const reactHooksRules = {
  ...reactHooksPlugin.configs.recommended.rules,
};

export default [
  {
    ignores: ["dist", "node_modules", "src-tauri/target", "**/*.d.ts", "vite.config.ts"],
  },
  js.configs.recommended,
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
  {
    files: ["src/**/*.{ts,tsx}", "src/**/**/*.{ts,tsx}", "src/**/**/**/*.{ts,tsx}"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: "./tsconfig.json",
        tsconfigRootDir: import.meta.dirname,
        ecmaFeatures: { jsx: true },
      },
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
    },
    rules: {
      ...tsRules,
      "@typescript-eslint/consistent-type-imports": "off",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/no-floating-promises": "off",
    },
  },
  {
    files: ["src/**/*.{ts,tsx,jsx,js}"],
    plugins: {
      react: reactPlugin,
      "react-hooks": reactHooksPlugin,
    },
    settings: {
      react: {
        version: "detect",
      },
    },
    rules: {
      ...reactRules,
      ...reactHooksRules,
      "react/prop-types": "off",
    },
  },
  eslintConfigPrettier,
];
