# Thai Web 2 Architecture

## Overview

This repository contains a multilingual Thai e-commerce storefront built with Next.js App Router, Supabase, next-intl, Tailwind CSS, and Zustand. The actual application lives in the `client` workspace; the root of the repository mainly holds supporting Supabase assets and repository-level notes.

The app is organized around a simple split:

- Server components fetch catalog and user data.
- Client components handle browser-only interaction such as cart updates, form submission, and locale switching.
- Supabase provides authentication and catalog persistence.
- next-intl provides locale-aware routing and translations.

## Architectural Intent

The design favors low-friction delivery of a storefront with a clear separation between presentation, data access, and state.

- The UI is mostly server-rendered for fast initial loads and direct data access.
- Interactive features are isolated into client components so browser state stays local and predictable.
- Cart state is stored in the browser with Zustand persistence, which avoids needing a backend cart service in the current phase.
- Localization is route-driven, which keeps language-specific content aligned with URL structure and rendering direction.

## Main Runtime Flow

1. The root route redirects to the default locale.
2. The locale layout validates the locale, loads translations, sets text direction, and renders the shared navigation shell.
3. The home page renders a hero section, category navigation, and the product grid.
4. Product and category data are fetched from Supabase on the server.
5. The product card adds items to the Zustand cart in local storage.
6. Authentication pages use the Supabase browser client and redirect through the auth callback route.

## Folder Structure

### Repository Root

- `README.md`: High-level repository notes.
- `package.json`: Minimal root-level package file with Supabase tooling.
- `supabase/`: Database migrations, seed data, and Supabase config.
- `client/`: The Next.js storefront application.
- `server/`: Present as a separate folder, but not currently a major part of the visible application flow.

### `client/`

#### `client/app/`

Next.js App Router entry points and route segments.

- `layout.tsx`: Root HTML shell and body-level styles.
- `page.tsx`: Redirects to the default locale.
- `[locale]/layout.tsx`: Locale-aware shell that loads messages, sets direction, and renders the navbar.
- `[locale]/page.tsx`: Home page composed from the hero, categories, and product grid.
- `[locale]/about/page.tsx`: Static about page.
- `[locale]/cart/page.tsx`: Client-side cart page.
- `[locale]/login/page.tsx`: Supabase login form.
- `[locale]/signup/page.tsx`: Supabase registration form.
- `[locale]/profile/page.tsx`: Authenticated profile screen.
- `auth/callback/route.ts`: Handles the Supabase email/OAuth callback and session exchange.

#### `client/components/`

Reusable UI and feature components.

- `NavBar.tsx`: Shared top navigation, user menu state, cart badge, and locale switcher.
- `Hero.tsx`: Landing page hero section and search input.
- `CategoryNav.tsx`: Category navigation strip loaded from Supabase.
- `ProductGrid.tsx`: Server-rendered product listing.
- `ProductCard.tsx`: Interactive product tile that adds items to the cart.
- `CartBadge.tsx`: Header cart indicator that reflects stored cart state.
- `LanguageSwitcher.tsx`: Client-side locale toggle.

#### `client/lib/`

Supabase client factories.

- `supabase-client.ts`: Browser client for interactive auth and client-side calls.
- `supabase-server.ts`: Server client that reads and writes cookies for authenticated server rendering.

#### `client/store/`

- `useCart.ts`: Zustand store for cart items, persistence, and item mutation helpers.

#### `client/i18n/`

- `routing.ts`: Locale definition and routing behavior.
- `request.ts`: Loads the correct locale messages for each request.

#### `client/messages/`

Translation dictionaries.

- `he.json`: Hebrew strings.
- `th.json`: Thai strings.

#### `client/public/`

Static assets served directly by Next.js.

## Data Layer

The Supabase schema in `supabase/migrations/20260418005145_initial_catalog_schema.sql` defines the core business entities:

- `profiles`: user metadata and roles.
- `categories`: catalog grouping with SEO-friendly slugs.
- `products`: product records, stock, pricing, and activation state.

Row-level security is enabled on the core tables. Public users can read active products and categories, while admin access is reserved by policy checks against the `profiles` table. A trigger creates a profile automatically when a new auth user signs up.

## State and Auth Model

The app currently uses three state channels:

- Server state from Supabase for products, categories, and authenticated user data.
- Browser auth state through the Supabase client in login and signup forms.
- Client-local cart state through Zustand with localStorage persistence.

This keeps checkout-free storefront interactions simple, while leaving room for a future server-backed order or cart system if the project grows.

## Constraints and Safety Notes

- The cart is local-only, so it is not synchronized across devices or browsers.
- Locale behavior depends on valid route prefixes; invalid locales fall through to a 404.
- Product and category reads assume the Supabase schema and policies are in place.
- Authentication flows depend on environment variables for the Supabase URL and anon key.
- Because some pages are server components and others are client components, browser-only APIs must stay inside client-marked modules.

## Summary

The codebase is intentionally compact: Next.js handles routing and rendering, Supabase handles persistence and auth, next-intl handles localization, and Zustand handles ephemeral client state. The structure is suitable for a storefront that needs fast server-rendered pages, bilingual UI, and a small but coherent feature set.