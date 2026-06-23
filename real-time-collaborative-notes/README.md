# NoteFlow

> Real-time collaborative notes powered by CRDTs. Multiple users edit the same document simultaneously with conflict-free merging — no refresh needed, no conflicts, no lag.

Built solo by [Thesigan](https://www.theju.dev).

![Demo](https://noteflow.theju.dev/og.webp)

---

## Features

- **Real-time collaboration** — Yjs CRDT syncs edits instantly across all connected clients. No conflicts, no locking, no merge surprises.
- **Rich text editing** — TipTap editor with bold, italic, strike, inline code, H1–H3 headings, bullet & ordered lists, blockquotes, and code blocks.
- **Collaborator awareness** — See who's online, their name, avatar, and color. Remote cursors show exactly where others are typing.
- **Google & GitHub OAuth** — Sign in with social accounts via BetterAuth. Session cookies, 2-day expiry with 1-hour sliding refresh.
- **Document management** — Dashboard with Owned / Shared / All filters. Create (max 3 per user) and delete documents you own.
- **Invite system** — Generate one-time invite links (24h expiry). Max 3 collaborators per document.
- **Debounced persistence** — Yjs document state saved to MongoDB 2 seconds after the last edit. In-memory Y.Doc cache with cleanup on last disconnect.
- **Rate-limited WebSocket** — 1300 messages/10s per socket, max 1 MB update size. Disconnect on violation.
- **Dark theme** — Custom Tailwind CSS v4 theme with deep purple accent, custom scrollbar, and typography plugin for prose styling.

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19, TypeScript 6, Vite 8, Tailwind CSS v4 |
| **Editor** | TipTap 3, `@tiptap/extension-collaboration`, `@tiptap/extension-collaboration-caret`, `@tiptap/y-tiptap` |
| **Real-time Sync** | Yjs (CRDT), socket.io 4, `y-protocols` |
| **Backend** | Express 5, TypeScript, socket.io 4 |
| **Database** | MongoDB via Mongoose 9 + native MongoDB driver (BetterAuth) |
| **Authentication** | BetterAuth 1.6 (Google OAuth, GitHub OAuth, session cookies) |
| **State Management** | TanStack Query (React Query) 5 |
| **Icons** | React Icons (Lu, Ri, Fa, Fc, Ai, Bi, Md icon sets) |
| **Validation / Utils** | `lodash-es` (debounce), `dayjs`, `uuid` |

---

## Architecture

```
┌─────────────┐     socket.io (WSS)     ┌──────────────┐     MongoDB
│  React App  │ ◄─────────────────────► │  Express 5   │ ◄──────────►
│  (TipTap +  │     Yjs binary sync      │  socket.io   │   Mongoose
│   Yjs)      │                         │  BetterAuth  │
└─────────────┘                         └──────────────┘
       │                                      │
       └──── REST (CRUD, invites) ────────────┘
```

### Key design decisions

**CRDT over OT.** Yjs uses a conflict-free replicated data type (CRDT) — every character gets a unique ID based on the peer clock, so edits from different users merge deterministically without a central orderer. There's no "last writer wins," no locking, and no merge conflicts.

**In-memory Y.Doc cache.** Yjs documents are held in a `Map<string, Y.Doc>` on the server. On first access, the document state is loaded from MongoDB and hydrated into a Y.Doc. A debounced `update` listener persists state back to MongoDB 2 seconds after the last mutation. When the last client disconnects, the in-memory doc and its debounced save are cleaned up.

**BetterAuth over custom auth.** BetterAuth handles OAuth flows, session management, CSRF, and email normalization out of the box. The adapter for MongoDB means credentials and sessions live in the same database as documents. The `useSession()` hook on the frontend mirrors the server-side session check.

**Socket.io with Yjs binary.** Yjs updates are binary (Uint8Array), not JSON. Socket.io's native binary transport sends them without base64 overhead. The `update` event carries raw binary deltas; the server applies them to the shared Y.Doc and broadcasts to the room.

**Awareness protocol.** Collaborator presence (name, color, avatar) is exchanged via `y-protocols/awareness`. Each client sends its local awareness state every 15 seconds as a heartbeat. The server relays awareness updates without processing them — it's a fire-and-forget broadcast.

---

## API

### REST Endpoints

| Method | Path | Auth | Description |
|---|---|---|---|
| ALL | `/api/auth/*` | No | BetterAuth routes (session, sign-in/sign-out, OAuth callbacks) |
| GET | `/api/documents` | Yes | List user's documents (owned + collaborated) |
| POST | `/api/documents` | Yes | Create document (max 3 per user) |
| GET | `/api/documents/:id` | Yes | Get document (owner or collaborator) |
| PATCH | `/api/documents/:id` | Yes | Update document fields |
| DELETE | `/api/documents/:id` | Yes | Delete document (owner only) |
| POST | `/api/invites/:id` | Yes | Generate invite token (owner only) |
| GET | `/api/invites/accept/:token` | Yes | Accept invite, join as collaborator |

### WebSocket Events

| Event | Direction | Description |
|---|---|---|
| `join-document` | client → server | Join a document room (auth + access check) |
| `sync` | server → client | Initial Yjs document state (binary) |
| `update` | bidirectional | Yjs binary update (broadcast to room) |
| `awareness` | bidirectional | Presence data (name, color, cursor) |
| `leave-document` | client → server | Leave room (triggers cleanup if empty) |
| `join-error` | server → client | Rejection on auth or access failure |

Rate-limited to 1300 messages/10s per socket. Max update size: 1 MB.

---

## Getting Started

### Prerequisites

- Node.js >= 20
- MongoDB instance (Atlas or local)
- Google and GitHub OAuth credentials (for social login)

### 1. Clone and install

```bash
git clone https://github.com/theju-bot/Projects.git
cd Projects/real-time-collaborative-notes

# Install dependencies — backend
cd backend && npm install

# Install dependencies — frontend
cd ../frontend && npm install
```

### 2. Environment variables

**`backend/.env`**

```env
MONGODB_URI=mongodb+srv://<user>:<pass>@<cluster>/real-time-collaborative-notes
PORT=5000
CLIENT_URL=http://localhost:5173
BETTER_AUTH_URL=http://localhost:5000
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
```

**`frontend/.env`**

```env
VITE_API_URL=http://localhost:5000/api
VITE_SERVER_URL=http://localhost:5000
VITE_URL=http://localhost:5173
```

### 3. Run

```bash
# Terminal 1 — backend
cd backend && npm run dev

# Terminal 2 — frontend
cd frontend && npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

### 4. Build

```bash
cd backend && npm run build
cd frontend && npm run build
```

---

## Project Structure

```
├── backend/
│   └── src/
│       ├── config/              CORS, MongoDB connection
│       ├── controllers/         Route handlers (documents, invites)
│       ├── lib/                 BetterAuth instance
│       ├── middleware/          Auth, request logging, error handler
│       ├── models/              Mongoose schemas (Document, InviteToken)
│       ├── routes/              Express routers
│       ├── socket/              Socket.io server + Yjs sync logic
│       ├── types/               Express type extensions
│       └── server.ts            Entry point
├── frontend/
│   └── src/
│       ├── components/          AuthGuard, editor (Toolbar, ShareModal, Avatars)
│       ├── hooks/               React Query hooks, Socket.io hook
│       ├── lib/                 Auth client, Axios instance, Socket.io client
│       ├── pages/               Auth, Dashboard, Editor, Join, NotFound
│       ├── types/               Shared TypeScript interfaces
│       ├── App.tsx              Router setup
│       ├── index.css            Tailwind v4 theme + global styles
│       └── main.tsx             React entry point
└── README.md
```

---

## LIVE Site

> **Live site:** [noteflow.theju.dev](https://noteflow.theju.dev)

---

## License

MIT
