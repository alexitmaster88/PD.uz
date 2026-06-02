# Style Guide

## TypeScript

The project uses strict TypeScript settings that require extra care:

- **`exactOptionalPropertyTypes: true`** — `x?: string` and `x?: string | undefined` are distinct types. When calling a function expecting `x?: string`, do not pass `x: value | undefined` — use a conditional spread: `...(value !== undefined && { x: value })`.
- **`noUncheckedIndexedAccess: true`** — Array indexing returns `T | undefined`. Use destructuring with defaults or null guards: `const [a = 0, b = 0] = arr` rather than `arr[0]`, `arr[1]`.
- **`verbatimModuleSyntax: true`** — Use `import type` for type-only imports.

Never use `any` for internal data. Cast through `unknown` when you need to break the type chain: `(value as unknown) as TargetType`.

---

## Components

### File organization

```
components/
├── ui/                     shadcn/ui primitives only — add via pnpm dlx shadcn@latest add
├── telc/
│   ├── TelcProvider.tsx    QueryClient + tRPC provider wrapper
│   ├── registration/       StepPersonalInfo, StepExamSelection, StepPayment, SuccessScreen
│   └── admin/              AdminExams, AdminPricing, AdminRegistrations
└── *.tsx                   Marketing site section components
```

- All client components start with `"use client"`.
- Marketing site components use `useLanguage()` from `contexts/language-context.tsx`.
- TELC components use `telcT(language, key)` from `lib/telc-i18n.ts` — not `useLanguage()`.
- Language-specific marketing variants: `language-specific-*.tsx` naming convention.

### shadcn/ui

Add new primitives with:
```bash
pnpm dlx shadcn@latest add <component-name>
```

Use the `cn()` helper from `lib/utils.ts` for conditional class merging:
```typescript
import { cn } from "@/lib/utils"
className={cn("base-class", condition && "conditional-class", props.className)}
```

---

## CSS Conventions

### Tailwind

Use Tailwind classes directly. CSS variable theming is enabled (`cssVariables: true` in `tailwind.config.ts`). Reference theme values with `text-primary`, `bg-background`, etc.

### TELC Utility Classes

Defined in `app/globals.css` — use these in TELC components instead of repeating Tailwind patterns:

| Class | Purpose |
|-------|---------|
| `telc-btn-primary` | Primary action button (blue, rounded) |
| `telc-btn-secondary` | Secondary/outline button |
| `form-group` | Vertical form field wrapper with spacing |
| `form-label` | Input label styling |
| `form-input` | Text/select input styling |
| `form-error` | Red error message text |
| `step-indicator` | Flex container for step dots + lines |
| `step-dot` | Step circle; add `.active` or `.completed` modifiers |
| `step-line` | Connector line between steps; add `.active` modifier |
| `qr-code-container` | Centered QR code display area |
| `reminder-box` | Highlighted reminder/info box |

Do not prefix these classes with `btn-` (conflicts with marketing site styles).

---

## tRPC Patterns

### Queries

```typescript
const { data, isLoading } = trpc.exams.list.useQuery()
```

### Mutations

```typescript
const mutation = trpc.exams.create.useMutation()
await mutation.mutateAsync({ levelId: 1, region: "tashkent", ... })
```

### Error handling in mutations

```typescript
try {
  await mutation.mutateAsync(input)
  toast.success("Done")
} catch {
  toast.error("Failed")
}
```

### Data fetching in TELC components

Prefer tRPC hooks for all TELC data. The REST fetch pattern (`fetch("/api/telc/...")`) used in `StepExamSelection` is a legacy pattern — new code should use tRPC hooks.

---

## Next.js App Router Conventions

### Async params (Next.js 15)

Page component `params` is a Promise — use `use()` to unwrap:

```typescript
import { use } from "react"

export default function Page({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = use(params)
  // ...
}
```

### Server vs client

- Route handlers (`app/api/`) are server-only — safe to use `SUPABASE_SERVICE_ROLE_KEY`
- tRPC route handler (`app/api/trpc/`) is server-only — `server/` directory never runs on client
- `lib/supabase.ts` browser client uses the anon key only — never the service role key
- `lib/trpc-client.ts` is client-only (`createTRPCReact`)

---

## i18n Conventions

### Marketing site (main pages)

```typescript
const { t } = useLanguage()
return <h1>{t("hero.title")}</h1>
```

Add new keys to all four files: `translations/de.ts`, `translations/en.ts`, `translations/ru.ts`, `translations/uz.ts`.

### TELC components

```typescript
import { telcT } from "@/lib/telc-i18n"

const text = telcT(lang, "registration.step1.title")
const withVar = telcT(lang, "payment.amount", { amount: "500,000" })
```

Use `lang` from URL params (passed down as a prop). Russian (`"ru"`) falls back to English automatically.

---

## Supabase Usage

### Browser client (anon key)

```typescript
import { supabase } from "@/lib/supabase"
const { data } = await supabase.from("table").select()
```

### Server client (service role key — route handlers only)

```typescript
import { createClient } from "@supabase/supabase-js"
const db = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
)
```

Never expose `SUPABASE_SERVICE_ROLE_KEY` to client code.

---

## Git Conventions

Commit message format from recent history:
```
featureName ActionDescription Date
```

Examples: `map_locationsUpdated`, `update taglines 18042026`, `TELC exam section update`.
