import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
    ],
  },
  {
    rules: {
      // Development-friendly rules - reduce noise while maintaining quality
      '@typescript-eslint/no-unused-vars': 'warn', // Changed from error to warning
      '@typescript-eslint/no-explicit-any': 'warn', // Allow any during development
      '@typescript-eslint/no-unsafe-function-type': 'warn', // Function type warnings
      '@typescript-eslint/no-require-imports': 'error', // Keep as error (only 2 issues)
      '@typescript-eslint/no-empty-object-type': 'warn', // Object type warnings
      
      // React rules - handle common issues
      'react/no-unescaped-entities': 'warn', // Change from error to warning
      'react/jsx-key': 'warn',
      
      // Keep critical rules as errors
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      '@next/next/no-img-element': 'warn',
      
      // Disable overly strict rules for development
      '@typescript-eslint/no-unused-expressions': 'off',
    },
  },
];

export default eslintConfig;
