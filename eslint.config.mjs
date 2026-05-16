import nextPlugin from "@next/eslint-plugin-next";
import tseslint from "typescript-eslint";

const eslintConfig = [
    {
        ignores: [
            ".next/**",
            "out/**",
            "build/**",
            "next-env.d.ts",
        ],
    },
    ...tseslint.configs.recommended,
    {
        files: ["**/*.{js,jsx,mjs,ts,tsx,mts,cts}"],
        plugins: {
            "@next/next": nextPlugin,
        },
        rules: {
            ...nextPlugin.configs["core-web-vitals"].rules,
            "@next/next/no-html-link-for-pages": ["error", "app"],
            "@next/next/no-server-import-in-page": "off",
        },
    },
];

export default eslintConfig;
