# Nirbhay Explorer AI — starter scaffold

A production-oriented starting point for the glass-liquid AI chatbot
described in the project spec: React + Vite frontend, Firebase
Authentication/Firestore, and Cloud Functions that keep the Gemini API
key off the client.

## What's here

```
src/
  components/
    glass/          GlassCard, GlassButton, GlassModal, GlassDrawer,
                     GlassMenu (three-dot menus), GlassToast
    Sidebar.jsx      Desktop sidebar / mobile drawer content
    ChatMessage.jsx  Message bubble + action toolbar (copy, read aloud,
                     share, screenshot, three-dot menu, edit/delete)
    RouteGuards.jsx  RequireAuth / RequireAdmin
    MaintenanceGate.jsx  Live Firestore-driven maintenance popup
  context/
    AuthContext.jsx  Firebase Auth wrapper + admin-claim check
    ThemeContext.jsx system/light/dark theme + 20 accent colors
  hooks/
    useReadAloud.js  Web Speech API wrapper, prefers Microsoft Edge's
                     online neural voices, falls back gracefully
  pages/
    Login.jsx, Chat.jsx, Settings.jsx, Admin.jsx, LegalRedirect.jsx
  firebase/config.js Firebase init with your supplied project config
  styles/theme.css   Design tokens: color, radius, shadow, spacing, motion

functions/
  src/auth.js        Sets the `role: "admin"` custom claim for
                      contact.nirbheexplorer@gmail.com on account creation
  src/ai.js           Secure Gemini proxy (chatWithGemini), admin-only
                      key storage in Secret Manager, basic rate limiting
  src/admin.js        Admin-only announcement + maintenance writes

firestore.rules       Security rules matching the access model above
firebase.json          Hosting + Functions + Firestore config
```

## Local setup

```bash
npm install
npm run dev              # starts Vite on http://localhost:5173
```

```bash
cd functions
npm install
```

## Firebase project setup (one-time)

1. In the Firebase console, enable **Authentication** (Email/Password,
   and Google if you want it) and **Firestore**.
2. Create the Gemini secret in Secret Manager:
   ```bash
   gcloud secrets create gemini-api-key --data-file=/path/to/key.txt
   ```
   Grant your Cloud Functions service account `Secret Manager Secret
   Accessor` on that secret.
3. Deploy rules and functions:
   ```bash
   firebase deploy --only firestore:rules,functions
   ```
4. Sign up once with `contact.nirbheexplorer@gmail.com` — the
   `setAdminClaim` function grants the admin role automatically on
   account creation. Sign out and back in so the new ID token (with
   the claim) is picked up.
5. In the Admin Panel, paste your real Gemini key — it's written to
   Secret Manager, never to Firestore or the browser.
6. Under **Admin → App Configuration**, map the three supplied Google
   Drive links to Terms / Privacy / Limitations / Documentation.

## What's stubbed vs. wired up

- **Wired:** Auth (email/password + Google), theme + accent system,
  glass component library, route guards, maintenance popup (live from
  Firestore), read-aloud with Edge voice preference, Cloud Functions
  for admin claim / Gemini proxy / key storage / announcements /
  maintenance.
- **Stubbed (marked with `TODO` comments):** wiring `Chat.jsx` to call
  `chatWithGemini` instead of the placeholder reply, persisting
  conversations to `users/{uid}/conversations/...`, streaming
  responses, screenshot capture (`dom-to-image-more` or similar),
  markdown rendering (`react-markdown` + `remark-gfm`, already in
  `package.json`), and writing theme/accent preferences to the user's
  Firestore profile instead of `localStorage` only.

## Notes

- The Firebase config in `src/firebase/config.js` uses the project
  values you provided. Firebase web API keys are public client
  identifiers, not secrets — the real protection is Firebase Auth +
  Firestore Security Rules + server-side admin checks, all of which
  are in place here.
- No emojis or stock illustration are used anywhere in the UI, per the
  spec — icons come from `lucide-react` only.
