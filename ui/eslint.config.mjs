import eslint from "@eslint/js"
import tseslint from "typescript-eslint"
import * as importPlugin from "eslint-plugin-import"
import reactRefresh from "eslint-plugin-react-refresh"
import reactHooks from "eslint-plugin-react-hooks"

const configFiles = ["*.config.ts", "*.config.?(m)js"]

export default tseslint.config(
    {
        ignores: ["node_modules", "dist", "build", ".storybook"],
    },
    {
        languageOptions: {
            parserOptions: {
                projectService: true,
                tsconfigRootDir: import.meta.dirname,
            },
        },
        plugins: {
            import: {
                // eslint-disable-next-line
                rules: importPlugin.rules,
            },
        },
        settings: {
            react: {
                version: "detect",
            },
        },
    },
    eslint.configs.recommended,
    ...tseslint.configs.recommendedTypeChecked,
    ...tseslint.configs.strictTypeChecked,
    {
        plugins: {
            "react-hooks": reactHooks,
            "react-refresh": reactRefresh,
        },
        rules: {
            // eslint-disable-next-line
            ...reactHooks.configs.recommended.rules,
        },
    },
    {
        rules: {
            "@typescript-eslint/no-unused-vars": [
                "error",
                {
                    argsIgnorePattern: "^_",
                    varsIgnorePattern: "^_",
                    caughtErrorsIgnorePattern: "^_",
                },
            ],
            "@typescript-eslint/restrict-template-expressions": "warn",
            "@typescript-eslint/no-unnecessary-condition": "warn",
            "@typescript-eslint/no-unnecessary-template-expression": "warn",
            "@typescript-eslint/no-confusing-void-expression": [
                "error",
                { ignoreArrowShorthand: true },
            ],
            "@typescript-eslint/no-floating-promises": "warn",
        },
    },
    {
        name: "Config files",
        files: configFiles,
        rules: {
            "@typescript-eslint/no-unsafe-assignment": "off",
        },
    }
)
