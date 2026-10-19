# Vael: Fashion Store Preset

A storefront for a **fictional** clothing label. Bone paper, ink black and one warm red, set in Instrument Serif and Inter Tight. It is a working shop front end: filters, a product sheet, a bag that remembers its contents, a promo code, a size finder and outfits you can add in one go. Every product picture is drawn in code and tinted per colourway, so the demo ships with no photographs to license.

Next.js 15 (static export) · GSAP 3 + ScrollTrigger · Lenis · plain CSS. No UI libraries, no state library.

```bash
npm install
npm run dev       # dev output goes to .next-dev, so builds never disturb a running dev server
npm run build     # static site in ./out, upload anywhere
```

## What is in it

| Part | What it does |
|---|---|
| Announcement bar & nav | Rotating messages above a centred wordmark, with search, saved items and bag counters. The bar folds away on scroll. On phones the links move into a full-screen menu. |
| Search | A sheet that drops from the top and filters the catalogue as you type, by name, category, fabric or colour. |
| Hero | A serif headline beside three featured pieces that drift at different speeds as you scroll. Each opens its product sheet. A ticker of shop promises runs underneath. |
| Categories | Six tiles that jump to the shop with that category selected. |
| The collection | Category chips (including New in and Saved), a size-in-stock filter, an On sale toggle and sorting. Cards have colour swatches that re-tint the picture, a save button, and on desktop a "Quick add" row of sizes on hover. |
| Product sheet | Slides in from the right: colour, size (sold-out sizes are struck out), quantity, fabric, fit and care, and two pieces that pair with it. Full screen on phones. |
| Bag | A drawer with quantity steppers, a free-shipping meter, a promo code (`WELCOME10` in the demo), discount and shipping totals, and a demo checkout. |
| The looks | Three outfits on a dark stage. Choose a size per piece and add the whole look at once. |
| Size finder | Chest measurement (cm or inches) and fit preference give a size. "Remember it" preselects that size on every product, in Quick add and in the looks. |
| How we make | Four counting figures, three materials and customer reviews. |
| Footer | Newsletter sign-up, links, payment methods and the wordmark at full width. |

The bag, saved items and remembered size are kept in `localStorage` (key `vael-store`), so they survive a reload.

## Re-skin

- **Brand, catalogue and copy**: `lib/content.ts`. Brand details, currency and locale, the free-shipping threshold, shipping cost and promo code, navigation, hero, categories, all products, the looks, the size chart, reviews and footer links.
- **Colour**: tokens at the top of `app/globals.css` (`--paper`, `--card`, `--ink`, `--accent`, `--night`).
- **Type**: `app/layout.tsx`.

### Adding a product

Add an object to `products` in `lib/content.ts`. `kind` picks the drawing (`coat`, `knit`, `shirt`, `tee`, `trousers`, `dress`, `tote`), `colours` come from the shared palette at the top of the file, and `soldOut` lists the sizes that cannot be chosen. Give it an existing `category`, or add a new one to `categories`.

### Using your own photos

Give a product an `images` array with one path per colour, in the same order as `colours`:

```ts
images: ['/products/alba-camel.jpg', '/products/alba-ink.jpg', '/products/alba-olive.jpg'],
```

Put the files in `/public`. Photos replace the drawing everywhere that product appears. A 4:5 portrait crop on a plain background works best.

## Connecting a checkout

The template is the storefront, not the payment system. `checkout()` at the top of `components/Bag.tsx` receives the bag (product id, colour, size and quantity per line) and is the one place to connect yours. In the demo it waits a moment, empties the bag and shows a confirmation; nothing is charged.

Common ways to finish it:

- **Shopify**: create a cart with the Storefront API and redirect to its `checkoutUrl`.
- **Stripe**: send the lines to a small server function that creates a Checkout Session, then redirect to it.
- **Snipcart or similar**: replace the bag drawer with their widget and keep the rest.

Prices, stock, discounts and shipping must be confirmed by your back end before payment. The totals in the bag are calculated in the browser for display only, and the promo code is checked in the browser too, so treat both as a preview.

The newsletter form in `components/Footer.tsx` is also a demo: send the address to your email platform in `join`.

## Accessibility & motion

Filters, swatches, sizes, steppers and tabs are real buttons, inputs and selects with visible focus and pressed states. Panels are dialogs that close with Escape, lock the page behind them and are hidden from assistive technology while closed. `prefers-reduced-motion` turns off the entrance animations, the ticker, the hero drift and smooth scrolling.

## Important

Vael, its products, prices, materials claims and reviews are fictional placeholders. Before a real shop goes live, replace them with your own and make sure every claim (materials, origin, repairs, returns, review counts) is true for your business.
