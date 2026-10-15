# Order Strong (protein-first restaurant recommender)

A mobile-first web app that tells you **what to order** at a restaurant to hit your protein goals. The dish is the unit, not the restaurant: pick a place, see its top 3 protein picks, customize, decide.

The restaurant catalog is served from **Supabase** (read-only, public). Without Supabase settings the app falls back to local mock data. All restaurants, dishes and nutrition numbers are fictional placeholders. Saved items stay in this browser's localStorage until accounts exist.

## Setup

Requires Node 20+ (developed on Node 24).

```bash
npm install
cp .env.example .env.local   # then fill in your Supabase URL and publishable key
npm run dev
```

Without `.env.local` the app runs on local mock data, so you can still try it offline. Never put a `service_role` or secret key in a `VITE_` variable: anything with that prefix is shipped to the browser. The publishable key is safe because Row Level Security only allows reads.

Open the URL Vite prints (usually http://localhost:5173). Use your browser's device toolbar at ~390px wide to see the mobile layout.

## Scripts

| Script | What it does |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Type-check (`tsc -b`) and build for production into `dist/` |
| `npm run lint` | Lint with [oxlint](https://oxc.rs) (React, TypeScript, and jsx-a11y rules) |
| `npm test` | Run the tests once (Vitest + React Testing Library) |
| `npm run test:watch` | Run tests in watch mode |
| `npm run preview` | Serve the production build locally |

### Dev switches for loading and error states (mock data only)

When running on mock data, the repository simulates a short network delay. Add these to any URL when loading the app:

- `?slow=1` makes every request take about 2 seconds, so loading states are easy to see.
- `?fail=1` makes every request fail, so you can see the error state and "Try again" button.

An empty state shows up when you search for something that doesn't exist (try `zzz`).

## Stack

React 19 · TypeScript (strict) · Vite · React Router · Tailwind CSS v4 · Leaflet (maps) · Vitest + React Testing Library.
Runtime dependencies are just `react`, `react-dom`, and `react-router`. No state-management library; the only shared state is the saved-items context.

## Project structure

```
src/
  types/                  Restaurant, Dish, ProteinEstimate, saved-item types
  data/
    restaurantRepository.ts          the API components use; picks Supabase or mock
    supabaseRestaurantRepository.ts  Supabase queries and row mapping
    mockRestaurantRepository.ts      local fallback (also used by tests)
    supabaseClient.ts, database.types.ts
    savedRepository.ts               saved dishes / restaurants (localStorage for now)
    simulate.ts                      fake network delay and failures (mock only)
    mock/                            fictional restaurants and dishes
  supabase/                 SQL migration and seed data (outside src/)
  lib/                    pure helpers: ranking, filtering, sorting, price presets, hooks
  components/             shared UI: Layout, Button, Chip, Sheet (native <dialog>), status views
  features/
    restaurants/          home (search, price filter, cards) and restaurant detail
    dishes/               dish detail bottom sheet / side panel
    saved/                saved context and the Saved screen
  routes.tsx              route table
```

Components never import `data/mock/*`. They call the repository functions, which return Promises.

### Routes

- `/` home: search, price filter, restaurant cards; `/?view=map` shows the same results as pins on a map
- `/r/:restaurantId` restaurant detail: top 3 picks, full menu with filters and sorting
- `/r/:restaurantId/dish/:dishId` the dish sheet, shown over the restaurant page
- `/saved` saved items
- `/login` sign in, create account, and "forgot password" (login is optional; browsing never requires it)
- `/account` signed-in email and Sign out
- `/reset-password` where the link in a password-reset email lands

Filters live in the URL (for example `?minProtein=30&sort=price`), so the Back button restores them and links are shareable. The dish sheet is a nested route, so Back closes it.

### How the numbers work

- Protein is an estimate range (`minG`–`maxG`) with a confidence label (`high`, `medium`, `low`).
- Dishes are ranked by the **midpoint** of the range, breaking ties by confidence, then protein per dollar.
- "Minimum protein" filters on the midpoint too, so a 38–45g dish shows up under 40g+.
- Protein per dollar is the midpoint divided by the price.

## Tests

- `src/lib/protein.test.ts`: ranking, tie-breaking, sorting, and filtering logic
- `src/data/restaurantRepository.test.ts`: search, price overlap, lookups, and simulated failures (tests always use the mock data, never the network)
- `src/data/supabaseRestaurantRepository.test.ts`: row mapping, filter building (including special characters), error handling, using a fake client
- `src/features/restaurants/HomePage.test.tsx`: the List / Map toggle, filters carried over to the map, selecting a pin (Leaflet itself is swapped for a stand-in in tests)
- `src/features/restaurants/RestaurantPage.test.tsx`: top 3 picks, menu filters, opening a dish and saving it

## Map

The home screen has a List / Map toggle (`RestaurantMapPanel.tsx`, `RestaurantMap.tsx`). It uses [Leaflet](https://leafletjs.com) with OpenStreetMap tiles, so no API key or account is needed. The map code loads on demand, so it doesn't slow the first page load.

- Each restaurant is a pin showing its price level. Pins are keyboard-focusable (Tab, then Enter). Selecting one shows that restaurant's card with its best protein pick and a link to its page. The map follows the same search and price filters as the list, and the choice is kept in the URL (`?view=map`).
- **Locations are samples.** The coordinates are made-up positions around downtown Wheaton, IL, worked out from each restaurant's mock distance, so the map and the "mi" figures agree. They live in the `latitude` / `longitude` columns (and `src/data/mock/restaurants.ts`).
- **Tiles:** the free `tile.openstreetmap.org` server is fine for development and light use, but its [usage policy](https://operations.osmfoundation.org/policies/tiles/) doesn't allow heavy production traffic. Before launch, switch `TILE_URL` and `ATTRIBUTION` in `RestaurantMap.tsx` to a hosted provider (for example MapTiler, Stadia Maps, or Mapbox). Keep the attribution the provider requires.
- Map tiles are requested from the tile server by each visitor's browser, so it sees their IP address. Mention that in your privacy policy.
- Not built yet: showing the person's own location (needs a permission prompt) and real distances from it.

## Brand assets

The favicon and link-preview (Open Graph) image use the app's own colors: terracotta brand, cream background.

- `brand/icon.svg`: the app icon (map pin with a fork, between two weight plates). Source for every favicon.
- `brand/og-image.html`: the 1200x630 link-preview image, laid out in HTML and SVG with an illustrated protein bowl.
- `node brand/render.mjs`: regenerates `public/favicon.svg`, `public/favicon.ico` (16/32/48), `public/apple-touch-icon.png` (180) and `public/og-image.png` using headless Edge or Chrome (set `CHROME=/path/to/browser` if it isn't found).

`index.html` links the icons and has the `og:` and `twitter:` tags. Link previews need absolute image URLs, so `vite.config.ts` replaces `__SITE_URL__` at build time with `VITE_SITE_URL` if set, otherwise Vercel's production domain (`VERCEL_PROJECT_PRODUCTION_URL`). Set `VITE_SITE_URL` if you add a custom domain or host somewhere else.

## Supabase backend

Project: `xrcoejcbolhuaexspbgf`. Config comes from `.env.local` (see `.env.example`).

**Schema** (`supabase/migrations/`: `20261008…create_restaurants_and_dishes`, then `20261009…add_restaurant_coordinates`):

- `restaurants` (id, name, cuisine, price_level, entree_min_price, entree_max_price, distance_mi, neighborhood, latitude, longitude, blurb)
- `dishes` (id, restaurant_id, name, description, price, protein_min_g, protein_max_g, protein_confidence, customization_tip, customizations, why_estimate)

Both tables have Row Level Security on, with a public `select` policy and no write policies, so the browser can read but never change the catalog. Seed data is in `supabase/seed.sql` (the same fictional data as `src/data/mock`). To change the catalog, edit it in the Supabase dashboard or run SQL with an authorized account.

**How the app uses it:** `src/data/restaurantRepository.ts` uses `supabaseRestaurantRepository.ts` when both env vars are set, otherwise `mockRestaurantRepository.ts`. Both implement the `RestaurantRepository` interface in `src/data/types.ts`, so screens don't know the difference. The home list loads each restaurant with its dishes in one request and picks the best protein dish in the app, using the same ranking as the restaurant page.

**After a schema change**, update `src/data/database.types.ts` (`supabase gen types typescript --project-id xrcoejcbolhuaexspbgf`) and the mapping functions at the top of `supabaseRestaurantRepository.ts`.

### Sign-in (Supabase Auth, email + password)

The screens are in `src/features/auth`. `AuthProvider` talks to an `AuthService` (`src/data/authService.ts`, Supabase implementation in `supabaseAuthService.ts`), and tests pass in a fake one, so no real accounts are created in tests. Error messages are mapped to friendly text in `friendlyAuthError`. Without Supabase settings, sign-in is hidden.

**One-time setup in the Supabase dashboard** (Authentication > URL Configuration), which the app can't do for you:

- Add `http://localhost:5173/**` and your deployed site's URL to **Redirect URLs**, and set **Site URL** to your deployed URL. Confirmation and reset emails link back to these. Until then they point at Supabase's default Site URL (`http://localhost:3000`).
- Under Authentication > Providers > Email, decide whether **Confirm email** is on. If it is, new people see "Check your email" after creating an account. If it's off, they're signed in immediately.
- Supabase's built-in email sender is rate-limited and meant for testing. Add your own SMTP provider before launch.

### Still to do for accounts

Saved items are still in `savedRepository.ts` (localStorage), so they don't follow a person across devices yet. Now that sign-in exists, rewrite it against user-scoped tables (for example `saved_dishes`, `saved_restaurants` with a `user_id` column) with RLS policies like `using ((select auth.uid()) = user_id)` and `with check` on the same predicate. Each function already returns the full `SavedState`, so `SavedProvider` doesn't change.

## Notes

- All restaurants, dishes, and nutrition numbers are fictional placeholders, not real nutrition claims.
- The app shows a short "estimates, not medical or dietary advice" note on the restaurant and dish screens.
