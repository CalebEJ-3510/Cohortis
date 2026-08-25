import js from "@eslint/js";
import eslintPluginPrettier from "eslint-plugin-prettier/recommended";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";

export default tseslint.config(
  { ignores: ["dist"] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2022,
      globals: globals.browser,
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
      "@typescript-eslint/no-unused-vars": "off",
      // Prevent accidental import of server-only packages in a client SPA
      "no-restricted-imports": [
        "error",
        {
          paths: [
            { name: "@tanstack/react-start", message: "This is a pure SPA — do not import SSR packages." },
            { name: "@lovable.dev/vite-tanstack-config", message: "Lovable dependency removed." },
          ],
        },
      ],
    },
  },
  eslintPluginPrettier,
);
