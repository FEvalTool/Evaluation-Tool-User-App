import js from "@eslint/js";
import globals from "globals";
import vitest from "@vitest/eslint-plugin";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import { defineConfig, globalIgnores } from "eslint/config";
import prettierPlugin from "eslint-plugin-prettier";
import prettierConfig from "eslint-config-prettier";

export default defineConfig([
    globalIgnores([
        "dist",
        "node_modules",
        ".config/*",
        ".vite",
        ".vscode",
        "coverage",
    ]),
    {
        files: ["**/*.{js,jsx}"],
        // 1. You MUST define the plugins and give them a nickname here
        plugins: {
            "react-hooks": reactHooks,
            "react-refresh": reactRefresh,
            prettier: prettierPlugin,
        },
        languageOptions: {
            ecmaVersion: 2020,
            globals: globals.browser,
            parserOptions: {
                ecmaVersion: "latest",
                ecmaFeatures: { jsx: true },
                sourceType: "module",
            },
        },
        rules: {
            // Use the recommended rules from the JS plugin
            ...js.configs.recommended.rules,

            // 2. Manually spread the react-hooks rules
            // This is safer in Flat Config to ensure they are registered correctly
            ...reactHooks.configs.recommended.rules,

            "react-refresh/only-export-components": [
                "warn",
                { allowConstantExport: true },
            ],
            "no-unused-vars": ["error", { varsIgnorePattern: "^[A-Z_]" }],

            // 3. Prettier rules (this handles your quotes and tabs)
            "prettier/prettier": [
                "error",
                {
                    singleQuote: false,
                    semi: true,
                    tabWidth: 4,
                    trailingComma: "all",
                },
            ],
        },
    },
    // 4. Lint config for unit test
    {
        files: ["**/*.test.{js,jsx}", "**/tests/setup.js"],
        plugins: {
            vitest,
        },
        languageOptions: {
            globals: {
                ...vitest.environments.env.globals, // This adds describe, it, expect, etc.
            },
        },
        rules: {
            ...vitest.configs.recommended.rules, // Optional: recommended vitest rules
            "vitest/no-focused-tests": "warn",
            "vitest/expect-expect": [
                "error",
                {
                    assertFunctionNames: ["expect", "render"],
                },
            ],
        },
    },
    // 5. prettierConfig must come LAST to override everything else
    prettierConfig,
]);
