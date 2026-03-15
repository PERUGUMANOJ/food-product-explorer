# FoodScope – Food Product Explorer

A modern, full-featured food product explorer built with **Next.js 15**, powered by the [OpenFoodFacts API](https://world.openfoodfacts.org/).

#live-link:https://delicate-macaron-a6b16b.netlify.app/
---

## 🚀 Features

### Core
- **Homepage Product Grid** – Displays food products fetched from OpenFoodFacts with product name, image, category, ingredients, and nutrition grade (A–E)
- **Search by Name** – Search food products by name using the OpenFoodFacts search API
- **Search by Barcode** – Instantly look up any product by its barcode number
- **Category Filter** – Filter products by 12+ popular categories (Beverages, Dairy, Snacks, etc.)
- **Sort Functionality** – Sort products by:
  - Name (A–Z / Z–A)
  - Nutrition Grade (Best / Worst first)
- **Load More Pagination** – Incrementally load more products (page-based)

### Product Detail Page
- Full product image
- Complete ingredients list
- Nutritional values table (energy, fat, carbs, proteins, salt, etc. per 100g)
- Nutrition grade with description
- Labels & certifications (vegan, organic, etc.)
- Allergens & additives
- Barcode display

### Bonus: Cart Functionality
- Add/remove products to a **persistent cart** (React Context + useReducer)
- Cart drawer with smooth slide-in animation
- Cart badge showing item count
- Checkout (clears cart)

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | **Next.js 15** (App Router, SSR for product detail pages) |
| Language | JavaScript (ES2024) |
| Styling | **Vanilla CSS** with CSS custom properties (dark mode, glassmorphism) |
| State Management | **React Context API** + `useReducer` |
| API | [OpenFoodFacts API](https://world.openfoodfacts.org/) (free, no key required) |
| Fonts | Google Fonts – Plus Jakarta Sans, Inter |
| Deployment Ready | Vercel / Netlify |

---

## 📁 Project Structure

```
food-explorer/
├── src/
│   ├── app/
│   │   ├── globals.css          # Global design system & styles
│   │   ├── layout.js            # Root layout with metadata
│   │   ├── page.js              # Homepage (Server Component wrapper)
│   │   └── product/[id]/
│   │       └── page.js          # Product Detail (SSR)
│   ├── components/
│   │   ├── Navbar.js            # Top navigation bar
│   │   ├── CartDrawer.js        # Slide-in cart sidebar
│   │   ├── HomePage.js          # Main homepage (Client Component)
│   │   ├── ProductCard.js       # Product grid card
│   │   └── ProductDetailClient.js # Product detail view (Client)
│   ├── context/
│   │   └── CartContext.js       # Global cart state (Context + useReducer)
│   └── lib/
│       └── api.js               # OpenFoodFacts API helpers + normalizers
├── next.config.mjs              # Next.js config (image domains)
└── README.md
```

---

## 🔌 API Endpoints Used

| Feature | Endpoint |
|---|---|
| Products by Category | `GET /category/{category}.json?page={n}&page_size=24` |
| Search by Name | `GET /cgi/search.pl?search_terms={name}&json=true&page={n}` |
| Product by Barcode | `GET /api/v0/product/{barcode}.json` |

---

## 🏃 Getting Started

### Prerequisites
- Node.js 18+ and npm

### Installation & Dev

```bash
cd food-explorer
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm start
```

---

## 🎨 Design Highlights

- **Dark mode** with deep navy/purple palette
- **Glassmorphism** – frosted glass navbar and cards
- **Radial gradient hero** with purple/pink glow effects
- **Nutrition grade badges** color-coded (A=green → E=red)
- **Smooth hover animations** on product cards
- **Responsive layout** – Mobile, tablet, and desktop friendly
- **Sticky sidebar** for filters on desktop; collapses to row on mobile

---

## ⏱️ Time Taken

**~3.5 hours** total

| Phase | Time |
|---|---|
| Project setup & architecture planning | ~20 min |
| Design system & global CSS | ~40 min |
| API integration & data normalization | ~30 min |
| Homepage + search + filter components | ~50 min |
| Product detail page (SSR) | ~30 min |
| Cart context + drawer | ~25 min |
| Testing & polish | ~25 min |

---

## 📝 Notes

- The OpenFoodFacts API is a public, open-data API by a French non-profit. No API key is required.
- Some category requests may encounter CORS redirect issues depending on network conditions; name search and barcode lookup are the most reliable.
- Product detail pages use **Next.js Server-Side Rendering** for better SEO and initial load performance.

# food-product-explorer
