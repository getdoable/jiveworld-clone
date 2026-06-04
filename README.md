# Jiveworld Clone — Crawler Regression Testbed

A self-contained clone of the Jiveworld language-learning web app, built for
**crawler regression testing**. The crawler captures UI *states* (not just
pages), so every filter, panel, and interactive view has its own URL or query
string, every internal link is a real `<a href>`, and all content is hardcoded
and deterministic (no randomness).

- **Frontend:** React + Vite + React Router + Tailwind CSS (SPA)
- **Backend:** Express.js (login + fake JWT + placeholder audio)

---

## Running it (two commands)

You need **two terminals** — one for the backend, one for the frontend.

### 1. Backend (Express, port 3001)

```bash
cd backend
npm install
npm start
```

Serves:
- `POST /api/login` — validates credentials, returns a fake JWT
- `GET  /api/me` — returns the fake user for a valid `Authorization: Bearer` token
- `GET  /media/*.mp3` — returns `200` + `Content-Type: audio/mpeg` (placeholder)
- `GET  /api/health` — `{ "ok": true }`

### 2. Frontend (Vite, port 5173)

```bash
cd frontend
npm install
npm run dev
```

Then open **http://localhost:5173**.

The Vite dev server proxies `/api` and `/media` to the backend on `:3001`, so the
app runs from a single origin. Start the backend first (or the login call will
fail with a friendly error).

---

## Login

The login page is at **`/login`**. Use the hardcoded credentials:

| Field    | Value                      |
| -------- | -------------------------- |
| Username | `testuser@jiveworld.com`   |
| Password | `password123`              |

On success, a fake JWT is stored in `localStorage` under `jw_token` and you are
redirected to `/es-en/app/learn/home`. The logged-in user is **"Test User"**.

All `/es-en/app/learn/*` routes check for the token and redirect to `/login` if
it is missing.

---

## Crawlable URLs

Every state below is a distinct URL. The frontend is a SPA, so each route is
served as `200` with `index.html` (history-API fallback) and the real state is
rendered client-side. Each page also injects an HTML comment at the top, e.g.
`<!-- PAGE STATE: stories?filter_type=topics&filter_value=Shorts -->`.

```
/login
/es-en/app/learn/home
/es-en/app/learn/stories
/es-en/app/learn/stories?primary=inProgress
/es-en/app/learn/stories?filter_type=topics&filter_value=Shorts
/es-en/app/learn/stories?filter_type=sb&filter_value=Completed+stories+with+unplayed+Soundbites
/es-en/app/learn/collections
/es-en/app/learn/collections/ciudad
/es-en/app/learn/progress
/es-en/app/learn/stories/perdido-en-san-jose
/es-en/app/learn/stories/boom-colapso
/es-en/app/learn/stories/luna-llena
/es-en/app/learn/stories/sentencia
/es-en/app/learn/stories/en-busca-de-las-palabras
/es-en/app/learn/stories/en-busca-de-las-palabras?soundbites=1
/es-en/app/learn/stories/miedo
/es-en/app/learn/stories/ra-nn
/es-en/app/learn/stories/ra-perro-raro
/es-en/app/learn/stories/el-superheroe
/es-en/app/learn/stories/ra-no-nos-compete
```

### Filter buttons (Stories page)

The filter bar buttons ("All in progress", "Completed stories", "Shorts",
"Find Soundbites I've done", "remove filters") are real `<a href>` links **and**
update the URL query string on click via `window.history.pushState`, so the
crawler sees each filtered state as a distinct URL. After pushing state they
dispatch a `popstate` event so React re-renders against the new URL.

---

## The manifest (`manifest.json`)

`manifest.json` at the repo root is the **regression baseline**. For each route
it records:

- **`url`** — the crawlable path (with query string for filtered states)
- **`status`** — expected HTTP status (`200` for all SPA routes)
- **`pageState`** — the value emitted in the page's `<!-- PAGE STATE: ... -->`
  comment and on the `data-page-state` attribute
- **`requiresAuth`** — whether the route redirects to `/login` without a token
- **`links`** — the key internal links the crawler should discover on the page
- **`uiElements`** — the key UI elements that should be present

It also has an `apiEndpoints` section describing `/api/login`, `/api/me`,
`/media/*.mp3`, and `/api/health` with their expected methods and statuses.

To diff against the baseline, crawl each `url`, confirm the status, that every
listed link is present, and that the listed UI elements render.

### Structure

```jsonc
{
  "name": "...",
  "description": "...",
  "auth": { "credentials": { ... }, "guard": "..." },
  "frontendBaseUrl": "http://localhost:5173",
  "backendBaseUrl": "http://localhost:3001",
  "routes": [
    {
      "url": "/es-en/app/learn/stories?filter_type=topics&filter_value=Shorts",
      "status": 200,
      "pageState": "stories?filter_type=topics&filter_value=Shorts",
      "requiresAuth": true,
      "links": ["/es-en/app/learn/stories/miedo", "..."],
      "uiElements": ["Heading 'Shorts'", "Story count '2 stories'", "..."]
    }
  ],
  "apiEndpoints": [ { "url": "/api/login", "method": "POST", ... } ]
}
```

---

## Project layout

```
jiveworld-clone/
├── manifest.json          # Crawler regression baseline
├── README.md
├── backend/
│   ├── package.json
│   └── server.js          # Express: /api/login, /api/me, /media/*.mp3
└── frontend/
    ├── package.json
    ├── vite.config.js     # proxies /api and /media to :3001
    ├── tailwind.config.js
    ├── index.html
    └── src/
        ├── main.jsx
        ├── App.jsx        # all routes (React Router)
        ├── data/stories.js        # hardcoded, deterministic content
        ├── lib/auth.js            # localStorage session helpers
        ├── components/            # Sidebar, StoryCard, PageMarker, AppLayout, ...
        └── pages/                 # Login, Home, Stories, StoryDetail,
                                   # Collections, CollectionDetail, Progress
```

---

## Notes for the crawler

- **All internal navigation uses real `<a href>` tags** (rendered by React
  Router `<Link>` and plain anchors for filters) — no JS-only navigation.
- **No randomly generated content** — story lists, counts, chapters, soundbites,
  and stats are all hardcoded in `frontend/src/data/stories.js`.
- **Placeholder audio** — story pages embed `<audio src="/media/{slug}.mp3">`;
  the backend answers any `/media/*.mp3` with `200` + `audio/mpeg`.
- **Every page** injects `<!-- PAGE STATE: ... -->` at the top and exposes the
  same value on a `data-page-state` attribute for easy assertion.
```
