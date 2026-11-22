import { dirname } from "path"
import { fileURLToPath } from "url"
import { FlatCompat } from "@eslint/eslintrc"

const __dirname = dirname(fileURLToPath(import.meta.url))
const compat = new FlatCompat({ baseDirectory: __dirname })

const eslintConfig = [
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      "out/**",
      "build/**",
      ".claude/**",
      "next-env.d.ts",
      "public/**",
      "reports/**",
    ],
  },
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // ~70 existing `any`s (mostly untyped Supabase rows). Visible as warnings;
      // promote to "error" once DB row types are added.
      "@typescript-eslint/no-explicit-any": "warn",
    },
  },
]

export default eslintConfig
