# Thai Web 2 Architecture

## Overview

Thai Web 2 is a multilingual storefront built with Next.js App Router, Supabase, next-intl, Tailwind CSS, and Zustand.

The repository is now flattened. The Next.js application, i18n assets, and shared libraries live at the repository root. Supabase migrations and seed data remain under `supabase/`.

Core runtime split:

- Server components fetch catalog and user data.
- Client components handle browser-only behavior (cart updates, form interaction, locale switching).
- Supabase provides authentication and data persistence.
- next-intl provides locale routing and translation loading.

## Engineering Intent

### Why this structure

- Keep rendering server-first for fast initial paint and straightforward data loading.
- Keep interactive state local to client components to avoid unnecessary server complexity.
- Keep policy logic in shared helpers (`lib/`) and keep pages/components focused on orchestration and rendering.
- Keep authentication and redirect rules centralized to reduce security drift.

### Current decomposition strategy

Recent refactors intentionally split larger UI modules into smaller pieces:

- Authentication pages use shared building blocks (`components/auth/`) instead of repeating field and card logic.
- Navbar behavior is split into subcomponents (`components/navbar/` and `components/icons/`).
- Validation schemas are centralized in `lib/auth-validation.ts`.
- Admin product creation keeps Thai fields optional and fills missing Thai content from Hebrew via server-side translation before persistence.
- Cart checkout is intentionally not a server order flow; it assembles a WhatsApp handoff message from the current cart items and opens WhatsApp directly.

This supports readability and reduces repetitive logic per file.

## Security Posture

### Authentication and session

- Supabase Auth is the source of truth for identity.
- Server-side session cookies are handled by SSR helpers in `lib/supabase-server.ts` and request middleware in `proxy.ts`.
- Sensitive routes are checked before rendering.

### Authorization

- UX-level guards live in middleware and route logic.
- Data-level authorization is enforced by Supabase RLS policies.
- `profiles.role` drives role-aware behavior where required.

### Redirect safety

- Untrusted `next` query values are sanitized through `lib/routing-helpers.ts`.
- Redirects must be internal paths.
- Protocol-relative and malformed paths are rejected.
- Locale prefix normalization is enforced for auth flows.

## Main Runtime Flow

1. `app/page.tsx` redirects to the default locale.
2. `app/[locale]/layout.tsx` validates locale, loads locale messages, sets text direction, and renders shared shell.
3. Home page composes hero, category navigation, and product grid.
4. Products and categories are loaded from Supabase in server components.
5. Product cards dispatch cart updates through Zustand (`store/useCart.ts`).
6. Login and signup use browser Supabase client and redirect via sanitized paths.
7. Admin product save operations validate the Hebrew fields, auto-fill missing Thai fields, and persist localized values.
8. Cart checkout opens WhatsApp with a prefilled Hebrew order summary and line-item pricing.
9. Auth callback route exchanges auth code/session and returns users to safe in-app destinations.

## Current Project Structure

### Repository root

- `app/`: App Router pages, layouts, and route handlers.
- `components/`: UI and feature components.
- `components/auth/`: Shared auth UI building blocks.
- `components/navbar/`: Navbar subcomponents.
- `components/icons/`: Isolated icon components.
- `i18n/`: Routing and request-level translation loading.
- `lib/`: Shared helpers and adapters (routing, auth validation, Supabase clients).
- `messages/`: Locale dictionaries (`he.json`, `th.json`).
- `store/`: Client state (Zustand cart store).
- `supabase/`: Migrations, seed data, and config.

### App routes

- `app/layout.tsx`: Root shell.
- `app/page.tsx`: Redirect to default locale.
- `app/[locale]/layout.tsx`: Locale shell and top-level composition.
- `app/[locale]/page.tsx`: Home page.
- `app/[locale]/products/page.tsx`: All products view.
- `app/[locale]/categories/[slug]/page.tsx`: Category view with search.
- `app/[locale]/admin/products/page.tsx`: Admin product list.
- `app/[locale]/admin/products/new/page.tsx`: Admin product create form.
- `app/[locale]/admin/products/[id]/page.tsx`: Admin product edit form with localized field hydration.
- `app/[locale]/cart/page.tsx`: Client cart view.
- `app/[locale]/login/page.tsx`: Login form.
- `app/[locale]/signup/page.tsx`: Signup form.
- `app/[locale]/profile/page.tsx`: Authenticated user profile.
- `app/auth/callback/route.ts`: Supabase auth callback.

## Data Layer

Primary schema is defined by:

- `supabase/migrations/20260418005145_initial_catalog_schema.sql`
- `supabase/migrations/20260419185625_create_product_translations.sql`
- `supabase/migrations/20260419195507_update_categories.sql`

Key entities:

- `profiles`: user profile and role data.
- `categories`: category slug plus localized names.
- `products`: product inventory and localized fields.
- Products are identified by database `id`; the admin dashboard no longer relies on product slugs because there is no dedicated product detail page.

Seed strategy:

- `supabase/seed.sql` inserts base catalog and applies localized fields for Hebrew and Thai.

## Localization Model

- Supported locales are defined in `i18n/routing.ts`.
- Request-time message loading happens in `i18n/request.ts`.
- UI translations live in `messages/he.json` and `messages/th.json`.
- Domain objects (category/product names and descriptions) are localized via DB columns (`*_he`, `*_th`) with helper fallback logic in `lib/routing-helpers.ts`.

## State Model

The application intentionally keeps state simple:

- Server state: product/category/user data from Supabase.
- Client auth interactions: login/signup/profile actions via browser Supabase client.
- Client cart state: Zustand + localStorage persistence.
- Cart submission is a user-initiated outbound WhatsApp message, not a backend order persistence flow.

This is sufficient for a browsing-first storefront and keeps write complexity low.

## Constraints and Safety Notes

- Cart is local-only and not synchronized across devices.
- Locale prefix must remain valid; unknown locales should fail safely.
- Middleware checks improve UX but do not replace RLS.
- Browser-only APIs must stay in client components.
- Environment variables for Supabase URL and anon key are required for auth/data flows.
- Keep `.env.local` untracked.
- WhatsApp handoff text is intentionally formatted in Hebrew and should remain concise so the final message stays readable in chat.

## ADR-004: Centralized Redirect Sanitization

### Status

Accepted

### Context

Auth flows accepted user-controlled redirect values. Distributed redirect logic increased open-redirect risk and locale inconsistency.

### Decision

Use a shared redirect sanitizer in `lib/routing-helpers.ts` and apply it consistently in:

- `app/auth/callback/route.ts`
- `app/[locale]/login/page.tsx`
- `app/[locale]/signup/page.tsx`
- `proxy.ts`

### Consequences

- Positive: one auditable redirect policy.
- Positive: consistent locale-aware redirect behavior.
- Tradeoff: shared helper changes affect multiple integration points.

## Operational Sanity Baseline

- Lint command is `npm run lint` and uses ESLint CLI (`eslint .`).
- Build command is `npm run build`.
- Architecture changes should preserve pass status for both commands.

## Summary

The codebase is compact by design: Next.js for rendering/routing, Supabase for auth/data, next-intl for localization, and Zustand for lightweight client cart state. The current structure emphasizes clear boundaries, reusable subcomponents, and centralized safety policy.