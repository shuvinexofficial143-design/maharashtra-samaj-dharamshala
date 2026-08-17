# Maharashtra Samaj Dharamshala — Ujjain

A premium, responsive and bilingual (Hindi/English) presentation website for Maharashtra Samaj Dharamshala, Ujjain. This repository is an **unofficial sales demo**, not the organisation's live or official booking website.

## What is included

- Premium public website with responsive navigation and mobile quick actions
- Room catalogue and individual room detail views
- Seven-step demo booking request flow with date/guest-reactive sample availability
- Guarded localStorage persistence, demo booking-reference tracker and admin-controlled demo statuses
- Facilities, gallery, nearby places, about, FAQ and contact experiences
- Presentation-only administration dashboard at `/admin-demo`
- Private client presentation hub at `/management-preview` with a guided tour, one-click sample booking, guarded reset and printable approval checklist
- Bilingual AI Travel Assistant at `/ai-assistant` with site-aware offline answers, suggested prompts, typing feedback and graceful live-AI fallback
- Secure Groq-ready serverless proxy boundary in `api/ai-assistant.js`; no API secret is included in the browser bundle
- Accessible feedback toasts, reference-copy actions and guest/admin handoff links
- Centralised business content, room data, facilities, policies and contact configuration
- Local AI-generated concept imagery (no fragile third-party image URLs)
- Accessibility basics, semantic structure, focus states and reduced-motion support
- SEO metadata, favicon, `robots.txt` and a starter sitemap

## Setup

Requirements: Node.js 20 or newer and npm.

```bash
npm install
npm run dev
```

Open the local URL printed by Vite (normally `http://localhost:5173`).

## Commands

```bash
npm run dev        # start the local development server
npm run typecheck  # TypeScript validation
npm run lint       # ESLint checks
npm run test       # storage-service tests
npm run build      # production build
npm run preview    # preview the production build
```

On Windows PowerShell systems that block `npm.ps1`, use the equivalent `npm.cmd` commands, for example `npm.cmd run dev`.

## Important folders

- `src/data/site.ts` — business identity, manager phone, rooms, facilities, nearby places, policies, FAQs and gallery data
- `src/context/LanguageContext.tsx` — Hindi/English language state
- `src/components` — shared layout and presentation components
- `src/pages` — public pages, booking flow and admin preview
- `src/services/demoBookings.ts` — guarded local demo booking persistence and status updates
- `src/services/contactLinks.ts` — encoded WhatsApp and Maps links
- `src/services/clipboard.ts` — resilient Clipboard API helper with a browser fallback
- `src/lib/ai` — offline answer engine, live-proxy abstraction and AI tests
- `src/data/ai.ts` — bilingual suggested prompts
- `src/components/ai` — conversation experience and assistant states
- `api/ai-assistant.js` — optional server-side Groq proxy for compatible hosts
- `src/styles.css` — responsive design system and component styling
- `public/images` — optimized WebP delivery assets
- `source-assets/concept-originals` — original high-resolution concept-image masters

## Demo / placeholder information

The following content is intentionally illustrative and must be verified before any production launch:

- Room inventory, room sizes, occupancy and amenities
- Every displayed tariff and availability state
- Check-in/check-out rules, ID rules, cancellation and refund policies
- Property address, map pin, travel times and operational contact hours
- Testimonials (explicitly marked as sample/demo)
- Dashboard bookings, occupancy, revenue and guest records
- All current property photographs, which are AI-generated concept images

The manager contact number (`+91 97242 68494`) is stored centrally in `src/data/site.ts`. Confirm permission and ownership before publishing it.

## Demo disclaimer

> Unofficial Demo Concept — Prepared for presentation purposes. Final information, photographs, tariffs and policies require management approval.

No booking or contact form currently sends data to a server, no payment is collected, no room is held, and no authentication or security claim is made by the admin preview. The AI assistant stays offline unless its optional server endpoint is explicitly configured.

## AI Travel Assistant

Open `/ai-assistant` or use the floating **Ask AI** action. Without configuration, the assistant remains useful in **AI demo mode** and answers common questions from the existing room, booking, nearby-place and management-demo data.

Demo mode supports:

- Family and room-category suggestions based on sample occupancy
- Booking-request and status-tracking guidance
- Nearby-place summaries without claiming official timings or distances
- Demo-versus-production and management-preview explanations
- Safe payment, tariff and management-contact boundaries

If a configured live request fails or returns an invalid response, the UI automatically shows a relevant offline answer and offers a retry action.

## Optional Groq setup

The Groq secret must remain server-side. Do **not** create `VITE_GROQ_API_KEY`; all `VITE_*` values are exposed to browser code.

1. Copy `.env.example` to an untracked environment file.
2. Set `GROQ_API_KEY` and, if required, `GROQ_MODEL` in the server/deployment environment.
3. Set `VITE_AI_API_ENDPOINT=/api/ai-assistant` during the frontend build.
4. Run through a host or local platform runtime that executes `api/ai-assistant.js`—for example Vercel Functions / `vercel dev`.

```dotenv
VITE_AI_API_ENDPOINT=/api/ai-assistant
GROQ_API_KEY=your_server_only_key
GROQ_MODEL=llama-3.3-70b-versatile
```

For local function testing, run `npx vercel dev --listen 3001`. The function can load the untracked root `.env.local` only in a local/development runtime when Vercel has not already injected `GROQ_API_KEY`. Preview and production deployments must receive the secret from Vercel Environment Variables; the browser never receives it.

The normal Vite command does not execute the serverless API route and therefore continues in offline demo mode. A real Groq key is never required for installation, testing or production frontend builds.

## Android demo APK

The existing Vite application is packaged in the generated `android/` project with Capacitor. Android builds use `.env.android`, which contains only the public deployed AI endpoint. The Groq credential stays in the Vercel function environment and is never copied into the web bundle or APK.

Requirements: Android Studio/SDK, JDK 21 (the build helper detects Android Studio's bundled JBR on Windows), Node.js and npm. `android/local.properties` is machine-local and points Gradle to the detected SDK.

```bash
npm.cmd run android:build     # Android-mode Vite build, Capacitor sync, assets, Gradle debug APK and artifact copy
npm.cmd run android:open      # sync and open the native project in Android Studio
npm.cmd run android:run       # sync and run on a connected device/emulator
npm.cmd run android:check:ai  # harmless live endpoint health check
```

The repeatable debug build copies the installable APK to `artifacts/Maharashtra-Samaj-Dharamshala-Demo-v1.0.0.apk`. This is debug-signed for direct client testing, not Play Store distribution.

## Client presentation

Open `/management-preview` directly; it is intentionally omitted from the public navigation. The redesigned image-led showcase includes five prominent actions, presentation metrics, an interactive eight-step journey, the AI future section and management inputs in one place.

### Recommended presentation flow

1. Introduce the homepage and visible unofficial-demo boundary.
2. Compare room categories and open the Standard AC room detail page.
3. Walk through the booking request, or use **Create sample booking** on the presentation page.
4. Open the generated reference in the guest status view.
5. Open `/admin-demo`, select the same record and demonstrate a status update.
6. Return to `/management-preview` for scope comparison and management approvals.
7. Open the AI Assistant and try the family-room or management-demo suggested question.
8. Print the production-input checklist and assign owners for missing information.

**Reset demo records** removes only booking records created by the demo in the current browser. Built-in read-only samples, configuration and website content are not removed.

## Deployment readiness

The production output is generated in `dist` with `npm run build`. No environment variables or API keys are required for the offline presentation build.

- **Vercel:** import the repository, use the Vite preset, build command `npm run build` and output directory `dist`. `vercel.json` limits the SPA fallback to browser routes so Vite modules, built assets and `/api/*` keep their native handlers; `api/ai-assistant.js` remains the optional live-AI function.
- **Netlify:** use build command `npm run build` and publish directory `dist`. `public/_redirects` provides the route fallback. Offline AI works as-is; live AI requires an equivalent Netlify Function or external secure proxy.
- After deployment, verify direct loading of `/rooms/standard-ac`, `/booking-status`, `/admin-demo`, `/management-preview` and `/ai-assistant` in addition to the homepage.
- Treat the deployed URL as an unofficial presentation until all property information, imagery, policies and permissions are approved.

## Production roadmap

1. Obtain management approval, official identity assets, verified copy and property photography.
2. Confirm address, tariffs, room inventory, policies, contact hours and tax requirements.
3. Connect Supabase/PostgreSQL for inventory, bookings, enquiries and role-based admin access.
4. Add server-side validation, audit logs, rate limiting, backups and privacy/terms pages.
5. Integrate approved WhatsApp/email notifications and only then evaluate Razorpay/UPI.
6. Add analytics consent, production monitoring, an official domain and final SEO URLs.
7. Run accessibility, content, security and real-device acceptance testing before launch.
