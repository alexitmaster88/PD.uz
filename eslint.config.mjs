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
      // DB rows are typed via types/database.ts; use those instead of `any`.
      "@typescript-eslint/no-explicit-any": "error",
    },
  },
]

export default eslintConfig
