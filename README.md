# E-commerce Storefront

A responsive, client-side e-commerce storefront built with HTML, CSS, and vanilla JavaScript.

## Features

- Responsive desktop and mobile layouts
- Product catalogue and single-product view
- Shopping cart persisted in `localStorage`
- Cart quantity updates and item removal
- Coupon codes and discount calculations
- Simulated checkout flow
- Light and dark theme support with persisted preference
- Product, blog, about, and contact pages
- Reusable storefront styling and image assets

## Project Structure

```text
.
├── assets/       # Product, banner, feature, blog, and other media
├── css/
│   └── style.css # Shared styles and responsive rules
├── experiments/  # Small standalone experiments
├── js/
│   └── script.js # Navigation, theme, cart, and page interactions
├── pages/        # Store pages
└── index.html    # Homepage
```

## Running Locally

This is a static website and does not require a build step or backend.

1. Clone or download the repository.
2. Open `index.html` directly in a browser, or serve the project with a local static server.
3. Use the navigation to browse products and test the cart features.

For example, with Python installed:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000` in a browser.

## Cart and Coupon Behavior

Cart items and the selected theme are stored locally in the browser. The checkout action is a demonstration only and does not process real payments or create server-side orders.

Available demo coupons include:

- `SAVE10`
- `SAVE20`
- `SAVE50`
- `BONPRIX`

## Notes

- The project has no server-side API or database.
- Do not add credentials, private keys, personal data, or production secrets to this repository.
- External assets such as the Remix Icon stylesheet are loaded from their public CDN.
