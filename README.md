# E-commerce Storefront

A modern, responsive, client-side e-commerce storefront built with semantic HTML5, modern CSS3, and vanilla JavaScript (no frameworks or external build tools required).

## Features

- **Mobile-First Responsive Design**: Optimized layouts across phones (down to 320px), tablets, and desktop displays with zero horizontal overflow.
- **Dynamic Shopping Cart**:
  - Add items from product cards or single-product detail page.
  - Interactive quantity adjustments and item removal.
  - Real-time navbar cart badges with count indicators.
  - Interactive toast notifications with direct links to the cart.
  - Responsive mobile cart layout using card-based formatting with dedicated remove buttons aligned under quantities.
  - Cart state persisted in browser `localStorage`.
- **Cart Summary & Discounts**:
  - Cart subtotal, free shipping indicator, and order total calculations displayed outside individual items.
  - Promo/coupon code system (`SAVE10`, `SAVE20`, `SAVE50`, `BONPRIX`) with automatic discounts.
- **Product Views**:
  - Multi-category catalogue and featured products grid.
  - Single-product detail page (`singprod.html`) with interactive thumbnail gallery and size/quantity selectors.
- **Dark & Light Mode**:
  - Smooth theme switching with persistent user preference in `localStorage`.
  - Automatic fallback to system color scheme (`prefers-color-scheme`).
  - Fast inline script in `<head>` to prevent flash of unstyled content (FOUC).
- **Navigation & Mobile Drawer**:
  - Off-canvas navigation menu with smooth transform animations for mobile viewports.
  - Click-outside-to-close behavior.
- **Multi-page Architecture**:
  - Dedicated pages for Home, Shop, Product Detail, Cart, Blog, About, and Contact.

## Project Structure

```text
.
├── assets/             # Media assets (product images, banners, logos, icons)
│   ├── about/
│   ├── banner/
│   ├── blog/
│   ├── feature/
│   ├── footer/
│   ├── people/
│   └── products/
├── css/
│   └── style.css       # Unified design tokens, responsive rules, and themes
├── js/
│   └── script.js       # App logic: navigation, theme, cart state, and coupons
├── pages/              # Storefront secondary pages
│   ├── about.html      # About page
│   ├── blog.html       # Blog & articles page
│   ├── cart.html       # Shopping cart & checkout preview
│   ├── contact.html    # Contact details & form
│   ├── shop.html       # Product catalogue & collection
│   └── singprod.html   # Single-product detail page & gallery
├── index.html          # Storefront homepage
└── README.md           # Project documentation
```

## Running Locally

This is a static website and does not require Node.js, build pipelines, or backend dependencies.

### Option 1: Direct File Access
Open `index.html` directly in any modern web browser (Chrome, Firefox, Safari, Edge).

### Option 2: Local HTTP Server (Recommended)
Running a local development server ensures proper asset path resolution:

**Using Python 3:**
```bash
python3 -m http.server 8000
```
Then visit `http://localhost:8000` in your browser.

**Using Node.js (via npx):**
```bash
npx serve .
```

## Cart and Coupon System

Cart items and theme settings are managed entirely client-side using `localStorage`:
- `storefront_cart`: Array of items currently in the cart (id, title, price, image, size, quantity).
- `storefront_theme`: Selected theme preference (`"dark"` or `"light"`).
- `storefront_coupon`: Applied coupon discount object.

### Sample Demo Coupons

| Coupon Code | Discount | Description |
| :--- | :--- | :--- |
| `SAVE10` | 10% Off | 10% discount on cart subtotal |
| `SAVE20` | 20% Off | 20% discount on cart subtotal |
| `SAVE50` | 50% Off | 50% discount on cart subtotal |
| `BONPRIX` | $50 Off | Flat $50 discount on cart subtotal |

## Security & Privacy Notes

- This project is a demonstration storefront with no server-side API or backend database.
- Checkout is simulated for demonstration purposes; no actual payment processing takes place.
- Do not commit credentials, secret keys, or private customer data to this repository.
- Icons are loaded from the public [Remix Icon CDN](https://remixicon.com).
