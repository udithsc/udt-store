# UDT Store

UDT Store is a modern e-commerce storefront built with Next.js App Router, React, Tailwind CSS, and Zustand. It currently runs as a front-end demo using local mock product and banner data, with persistent cart and wishlist state stored in the browser.

## Features

- Responsive storefront home page with hero, featured products, category links, promotional sections, best sellers, and footer banner.
- Shop catalog with category filtering, price filtering, sorting, grid/list views, wishlist actions, and add-to-cart actions.
- Static product detail pages generated from local product slugs.
- Product detail experience with image thumbnails, badges, ratings, quantity controls, tabs, related products, cart actions, and wishlist actions.
- Cart page with quantity controls, removal, coupon input UI, totals, estimated shipping, and tax.
- Checkout form with billing/shipping fields, order notes, payment option selection, and terms confirmation.
- Wishlist page with persistent saved items, add-to-cart flow, total value summary, and clear-all controls.
- Account page with a client-side sign-in demo, account dashboard, order tracking form, address view, and account details form.
- About and contact pages with store information, contact form UI, map embed, and support CTAs.
- PWA manifest, service worker registration, and install prompt component.

## Tech Stack

- Next.js 16 with App Router
- React 19
- TypeScript for App Router files, with JavaScript/JSX components enabled
- Tailwind CSS 4 via `@tailwindcss/postcss`
- Zustand with `persist` middleware for cart and wishlist state
- `react-hot-toast` for cart/wishlist feedback
- `react-icons` for interface icons
- `canvas-confetti` for the order success animation

## Getting Started

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Build for production:

```bash
npm run build
```

Start the production server after building:

```bash
npm run start
```

Lint the project:

```bash
npm run lint
```

Format files:

```bash
npm run format
```

## Routes

| Route | Purpose |
| --- | --- |
| `/` | Storefront home page with merchandising sections. |
| `/shop` | Product catalog with filters, sorting, and grid/list view modes. |
| `/shop?category=<category>` | Opens the shop with a category filter preselected from the query string. |
| `/product/[slug]` | Product detail page generated from the local mock product list. |
| `/cart` | Shopping cart with item controls and totals. |
| `/checkout` | Checkout form and payment option UI. |
| `/success` | Order confirmation page that clears browser storage and runs confetti. |
| `/wishlist` | Saved products, wishlist summary, and add-to-cart actions. |
| `/account` | Client-side account demo with sign-in, dashboard, order tracking, address, and details tabs. |
| `/about` | About page and company/support feature sections. |
| `/contact` | Contact form UI, store locations, Google map embed, and support CTAs. |

The navigation also contains links such as `/blog`, `/login`, `/register`, `/forgot-password`, and `/terms`; those pages are not implemented yet.

## Project Structure

```text
src/
  app/                  App Router pages and root metadata/layout
  components/           Reusable page sections and client-side experiences
  lib/
    client.js           Local mock product/banner data access helpers
    utils.js            Shared utilities, including success-page fireworks
  stores/
    cartStore.js        Persistent Zustand cart store
    wishlistStore.js    Persistent Zustand wishlist store
  styles/
    globals.css         Tailwind import, theme tokens, base styles
public/
  manifest.json         PWA metadata and shortcuts
  sw.js                 Basic service worker
```

## Data Model

Product and banner content is defined in `src/lib/client.js`.

Products currently include:

- `_id`
- `name`
- `slug`
- `price`
- `originalPrice`
- `image`
- `details`
- `featured`
- `category`
- `rating`
- `reviews`
- `inStock`
- `badges`

The helper functions are:

- `getProducts()` returns all mock products.
- `getProduct(slug)` returns one mock product by slug.
- `getBanners()` returns mock banner content.

When adding a product, make sure the `slug` is unique. Product detail pages are generated through `generateStaticParams()` in `src/app/product/[slug]/page.tsx`.

## State Management

Cart state lives in `src/stores/cartStore.js` and persists to `localStorage` under `cart-storage`. It stores cart items, total price, total quantity, and product-detail quantity controls.

Wishlist state lives in `src/stores/wishlistStore.js` and persists to `localStorage` under `wishlist-storage`. It stores saved products and exposes helpers for adding, removing, clearing, toggling, and counting wishlist items.

Because these stores depend on browser storage, cart and wishlist interactions run in client components.

## Styling

Global styles are in `src/styles/globals.css`.

The Tailwind theme defines:

- `primary` green: `#629d23`
- secondary slate tokens
- accent red tokens
- custom spacing values

Most UI is built directly with Tailwind utility classes in JSX components. Shared layout wrappers are provided by `src/components/Layout.jsx`, `Navbar.jsx`, and `Footer.jsx`.

## PWA

The root layout exposes `public/manifest.json`, and `PWAInstaller.jsx` registers `public/sw.js` on the client. The service worker currently caches the home route only. The manifest includes shortcuts for Shop, Account, and Cart.

## Current Limitations

- There is no backend, database, authentication provider, payment gateway, or order API.
- Product, banner, account, address, and location data are mock/static content.
- Contact, checkout, account, coupon, sharing, and order tracking forms are UI-only demos.
- `/success` clears all `localStorage`, which also removes wishlist state.
- Some linked routes are placeholders and will show a Next.js 404 until implemented.
- The product catalog category comparison is case-sensitive, while URL category parameters are lowercased in `ShopContent`; category links may need normalization before query-string filtering works reliably.

## Common Development Tasks

Add or edit products:

1. Update `mockProducts` in `src/lib/client.js`.
2. Add product images to `public/` or update image paths.
3. Confirm each product has a unique `slug`.

Add a new page:

1. Create a route under `src/app/<route>/page.tsx`.
2. Wrap the page in `Layout` when it should use the store header, footer, and PWA installer.
3. Add navigation links in `src/components/Navbar.jsx` or `Footer.jsx` if needed.

Replace mock data with an API:

1. Keep the `getProducts`, `getProduct`, and `getBanners` function names if possible.
2. Move data fetching into `src/lib/client.js` or a new lib module.
3. Update product types before tightening TypeScript coverage across JSX components.

Implement real checkout:

1. Add an order API route or server action.
2. Validate checkout form data.
3. Integrate a payment provider.
4. Clear only cart state after a successful order instead of all browser storage.
