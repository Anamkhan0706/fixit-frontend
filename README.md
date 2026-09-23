# FixIt — Front-End Application (Week 2)

A React front-end for **FixIt**, the local home services booking platform designed
in the Week 1 report. This week's deliverable is a fully functional, responsive
UI that simulates the complete customer experience — searching for a professional,
viewing their profile, booking a service, and tracking that booking's status —
built to be swapped over to the real backend (described in the Week 1 architecture
and API documentation) with minimal changes.

## Live views

| Route | Purpose |
|---|---|
| `/` | Landing / search page — hero, category filters, search, sortable results grid |
| `/professionals/:id` | Professional detail view — profile, reviews, and an inline booking form |
| `/dashboard` | Customer dashboard — all bookings with a live status stepper |
| `/login` | Mock login screen (client-side validation only) |
| `*` | 404 fallback |

All views share a responsive Navbar (with a mobile hamburger menu) and Footer, and
are fully interconnected via React Router — e.g. clicking a professional card on
the landing page routes to their detail view, submitting a booking there routes
to a confirmation screen with links into the dashboard, and so on.

## Development process

1. **Setup** — scaffolded with Vite's `react` template, then added React Router
   for navigation, Tailwind CSS for styling, and `lucide-react` for icons.
2. **Design system** — reused the color palette (brand blue `#2E74B5`) and layout
   conventions from the Week 1 wireframes and architecture diagrams so this build
   is visually consistent with the planning documents.
3. **Component-first build** — small, reusable pieces (`ProfessionalCard`,
   `StarRating`, `StatusStepper`, `Navbar`, `Footer`) were built before the pages
   that assemble them, so each page is mostly composition.
4. **Mock data layer** (`src/data/mockData.js`) — stands in for the Week 1 backend
   services (Auth, Booking, Review) so every view is genuinely interactive without
   a live API. Swapping this file for real `fetch`/`axios` calls against the
   endpoints documented in the Week 1 report is the intended integration point
   for a future backend-integration week.
5. **State management** — a single `AppContext` (React Context + `useState`)
   holds the booking list, exposes `addBooking`/`cancelBooking`, and persists to
   `localStorage` so bookings survive a page refresh — a lightweight stand-in for
   real server-side persistence at this stage.
6. **Testing** — every page was checked at desktop (1280px) and mobile (390px)
   widths, and the full booking flow (search → detail → fill form → submit →
   confirmation → appears on dashboard → cancel) was run end-to-end with
   Playwright to confirm the interactions actually work, not just that the pages
   render.

## Design patterns & libraries used

- **React Router v6** — client-side routing (`BrowserRouter`, `Routes`, `NavLink`
  for active-state nav links)
- **React Context** — app-wide booking state, avoiding prop-drilling across pages
  (`src/context/AppContext.jsx`)
- **Controlled forms** with inline, field-level validation (booking form, login
  form) — errors clear as the user corrects each field rather than only on submit
- **Composition over duplication** — `ProfessionalCard`, `StarRating`, and
  `StatusStepper` are each used in more than one place with different data
- **Tailwind CSS utility classes** — no separate CSS files per component; a small
  custom color token (`brand`) is added in `tailwind.config.js` to keep the
  palette consistent
- **Accessibility** — every form input has an associated `<label>`, invalid
  fields use `aria-invalid` and `aria-describedby`, icon-only buttons have
  `aria-label`, and the status stepper uses `role="list"`/`role="listitem"`

## Project structure

```
src/
  components/       Shared, reusable UI pieces
  context/           AppContext (global booking state)
  data/               Mock data standing in for backend responses
  pages/             One file per route
  App.jsx             Route definitions
  main.jsx            App entry point, providers
```

## Running the application locally

**Requirements:** Node.js 18+ and npm.

```bash
# 1. Install dependencies
npm install

# 2. Start the dev server
npm run dev
```

Then open the URL printed in the terminal (typically `http://localhost:5173`).

To build a production bundle:

```bash
npm run build
npm run preview   # serves the production build locally for a final check
```

## Notes for evaluators

- This is a front-end-only build. Login and bookings are simulated with mock
  data and `localStorage` — there is no real backend yet. The API contract this
  UI is designed against is documented in the Week 1 report (Section 6, "API
  Endpoints").
- Responsiveness was verified at both desktop and mobile breakpoints; the layout
  reflows to a single column and the nav collapses to a hamburger menu below the
  `md` (768px) breakpoint.
