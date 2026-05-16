# UDT Store

UDT Store is a modern e-commerce storefront built with Next.js App Router, React, Tailwind CSS, and Zustand. Products, homepage content, store settings, and orders are served by local Next.js API routes backed by a server-side JSON data store.

## Features

- Responsive storefront home page with hero, featured products, category links, promotional sections, best sellers, and footer banner.
- Shop catalog with category filtering, price filtering, sorting, grid/list views, wishlist actions, and add-to-cart actions.
- Dynamic product detail pages resolved from the backend product API.
- Product detail experience with image thumbnails, badges, ratings, quantity controls, tabs, related products, cart actions, and wishlist actions.
- Cart page with quantity controls, removal, coupon input UI, totals, estimated shipping, and tax.
- Checkout form with billing/shipping fields, order notes, payment option selection, and terms confirmation.
- Wishlist page with persistent saved items, add-to-cart flow, total value summary, and clear-all controls.
- Account page with a lightweight customer dashboard, order tracking form, address view, and account details form.
- Built-in admin CMS for catalog, homepage content, store settings, and sales orders.
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

| Route                       | Purpose                                                                                      |
| --------------------------- | -------------------------------------------------------------------------------------------- |
| `/`                         | Storefront home page with merchandising sections.                                            |
| `/shop`                     | Product catalog with filters, sorting, and grid/list view modes.                             |
| `/shop?category=<category>` | Opens the shop with a category filter preselected from the query string.                     |
| `/product/[slug]`           | Dynamic product detail page resolved from the backend product API.                           |
| `/cart`                     | Shopping cart with item controls and totals.                                                 |
| `/checkout`                 | Checkout form and payment option UI.                                                         |
| `/success`                  | Order confirmation page that clears browser storage and runs confetti.                       |
| `/wishlist`                 | Saved products, wishlist summary, and add-to-cart actions.                                   |
| `/account`                  | Customer account surface with sign-in, dashboard, order tracking, address, and details tabs. |
| `/admin`                    | Protected CMS dashboard for products, homepage content, settings, and orders.                |
| `/about`                    | About page and company/support feature sections.                                             |
| `/contact`                  | Contact form UI, store locations, Google map embed, and support CTAs.                        |

The navigation also contains support, policy, account, and editorial pages implemented through the dynamic informational route.

## Project Structure

```text
src/
  app/api/              Backend API routes for CMS, products, banners, settings, and orders
  app/                  App Router pages and root metadata/layout
  components/           Reusable page sections and client-side experiences
  lib/
    cmsDefaults.js      Empty form defaults for CMS editors
    client.js           API access helpers
    utils.js            Shared utilities, including success-page fireworks
  stores/
    cmsStore.js         Client-side CMS API state
    cartStore.js        Persistent Zustand cart store
    wishlistStore.js    Persistent Zustand wishlist store
  styles/
    globals.css         Tailwind import, theme tokens, base styles
public/
  manifest.json         PWA metadata and shortcuts
  sw.js                 Basic service worker
data/
  cms.json              Server-side CMS data store
```

## Data Model

Product, banner, settings, and order content is stored on the backend in `data/cms.json` and retrieved through API routes.

API routes:

- `GET /api/cms` returns the full CMS snapshot.
- `GET /api/products` returns all products.
- `POST /api/products` creates or updates a product.
- `GET /api/products/:idOrSlug` returns one product by id or slug.
- `PUT /api/products/:id` updates one product.
- `DELETE /api/products/:id` deletes one product.
- `GET /api/banners` returns homepage banners.
- `PUT /api/banners` updates the homepage banner.
- `GET /api/settings` returns store settings.
- `PUT /api/settings` updates store settings.
- `GET /api/orders` returns all sales orders.
- `POST /api/orders` creates a checkout order.
- `PATCH /api/orders/:id` updates an order, such as its status.

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

- `getProducts()` retrieves all products from `/api/products`.
- `getProduct(slug)` retrieves one product from `/api/products/:slug`.
- `getBanners()` retrieves homepage content from `/api/banners`.

When adding a product, make sure the `slug` is unique. Product detail pages are dynamic and resolve products through the API-backed CMS state.

## Admin CMS

The site includes a protected admin CMS at `/admin`. Unauthenticated users are redirected to `/admin/login`.

Admin credentials are read from environment variables:

```bash
ADMIN_USERNAME=admin@udtstore.local
ADMIN_PASSWORD=change-this-password
ADMIN_SESSION_SECRET=change-this-session-secret
```

The app does not ship fallback admin credentials. Copy `.env.example` to `.env.local`, set strong values, and restart the dev server before signing in to `/admin`.

The CMS can manage:

- Products: add, edit, delete, feature, price, stock status, category, badges, images, and descriptions.
- Homepage content: hero/footer banner text, image, CTA link, discount label, and featured product slug.
- Store settings: store name, support email, support phone, currency, shipping cost, and tax rate.
- Sales orders: checkout creates orders, and admins can view orders and update order status.

CMS data is loaded from backend API routes into `src/stores/cmsStore.js`. The current backend persists to `data/cms.json`; to make it production-grade like WordPress/WooCommerce, replace `src/lib/serverCms.js` with a database layer and connect the admin login to a proper user/auth provider.

Public users can read product, banner, and settings data. Admin-only access is required for:

- `POST /api/products`
- `PUT /api/products/:id`
- `DELETE /api/products/:id`
- `PUT /api/banners`
- `PUT /api/settings`
- `GET /api/orders`
- `PATCH /api/orders/:id`
- `POST /api/cms` clear action

## State Management

Cart state lives in `src/stores/cartStore.js` and persists to `localStorage` under `cart-storage`. It stores cart items, total price, total quantity, and product-detail quantity controls.

Wishlist state lives in `src/stores/wishlistStore.js` and persists to `localStorage` under `wishlist-storage`. It stores saved products and exposes helpers for adding, removing, clearing, toggling, and counting wishlist items.

CMS and order state is fetched into `src/stores/cmsStore.js` from the backend APIs.

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

- The CMS has API routes, admin session protection, and server-side JSON persistence, but there is no database or role/user table yet.
- There is no payment gateway or server-side order API.
- Customer account authentication is lightweight and should be connected to a customer identity provider before production launch.
- Contact, coupon, wishlist sharing, and customer order tracking should be connected to service APIs before production launch.
- `/success` clears cart state after checkout; orders remain available in the CMS order list.
- The product catalog category comparison is case-sensitive, while URL category parameters are lowercased in `ShopContent`; category links may need normalization before query-string filtering works reliably.

## Common Development Tasks

Add or edit products:

1. Sign in at `/admin`.
2. Use the Products tab to create or edit products.
3. Product records are persisted to `data/cms.json` through `/api/products`.

Seed products manually:

1. Update `products` in `data/cms.json`.
2. Add product images to `public/` or update image paths.
3. Confirm each product has a unique `slug`.

Add a new page:

1. Create a route under `src/app/<route>/page.tsx`.
2. Wrap the page in `Layout` when it should use the store header, footer, and PWA installer.
3. Add navigation links in `src/components/Navbar.jsx` or `Footer.jsx` if needed.

Replace JSON persistence with a database:

1. Replace the read/write functions in `src/lib/serverCms.js`.
2. Keep the existing `/api/products`, `/api/banners`, `/api/settings`, and `/api/orders` contracts.
3. Add schema validation before accepting admin writes.

Implement real checkout:

1. Validate checkout form data server-side.
2. Integrate a payment provider.
3. Store payment/order references on `POST /api/orders`.
4. Send transactional confirmation emails after order creation.
