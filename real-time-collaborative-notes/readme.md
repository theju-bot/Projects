# NoteFlow

Real-time collaborative notes powered by CRDTs. Multiple users edit the same document simultaneously with conflict-free merging.

Created by [thesigan](https://github.com/theju-bot).

## Features

- **Real-time collaboration** — Yjs CRDT syncs edits instantly across all connected clients
- **Rich text editing** — TipTap editor (bold, italic, headings, lists, blockquotes, code blocks)
- **Collaborator awareness** — See who's online, their name and cursor in document
- **Google & GitHub OAuth** — Sign in with social accounts via BetterAuth
- **Document management** — Dashboard with Owned/Shared/All filters, create (max 3) and delete
- **Invite system** — Generate one-time 24h invite links, max 3 collaborators per doc
- **Debounced persistence** — Yjs state saved to MongoDB 2s after last change
- **Dark theme** — Custom Tailwind v4 theme with purple accent

## Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | React 19, TypeScript, Vite 8, Tailwind CSS v4 |
| Editor | TipTap, `@tiptap/extension-collaboration` |
| Sync | Yjs (CRDT), socket.io, `y-protocols` |
| Backend | Express 5, TypeScript, socket.io |
| Database | MongoDB (Mongoose + raw driver for BetterAuth) |
| Auth | BetterAuth (Google + GitHub OAuth, session cookies) |
| State | React Query (TanStack Query) |

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

## Getting Started

### Prerequisites

- Node.js >= 20
- MongoDB instance (Atlas or local)

### 1. Clone and install

```bash
git clone https://github.com/theju-bot/Projects.git
cd Projects/real-time-collaborative-notes

# Backend
cd backend && npm install

# Frontend
cd ../frontend && npm install
```

### 2. Environment variables

**backend/.env**
```
MONGODB_URI=mongodb+srv://<user>:<pass>@<cluster>/real-time-collaborative-notes
PORT=5000
CLIENT_URL=http://localhost:5173
BETTER_AUTH_URL=http://localhost:5000
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GITHUB_CLIENT_ID=...
GITHUB_CLIENT_SECRET=...
```

**frontend/.env**
```
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

Open `http://localhost:5173`.

## API

### REST Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| ALL | `/api/auth/*` | No | BetterAuth (session, sign-in/sign-out, OAuth callbacks) |
| GET | `/api/documents` | Yes | List user's documents (owned + collaborated) |
| POST | `/api/documents` | Yes | Create document (max 3 per user) |
| GET | `/api/documents/:id` | Yes | Get document (owner or collaborator) |
| PATCH | `/api/documents/:id` | Yes | Update document fields |
| DELETE | `/api/documents/:id` | Yes | Delete document (owner only) |
| POST | `/api/invites/:id` | Yes | Generate invite token (owner only) |
| GET | `/api/invites/accept/:token` | Yes | Accept invite, join as collaborator |

### WebSocket Events

| Event | Direction | Description |
|-------|-----------|-------------|
| `join-document` | client → server | Join a document room (auth + access check) |
| `sync` | server → client | Initial Yjs document state |
| `update` | bidirectional | Yjs binary update (broadcast to room) |
| `awareness` | bidirectional | Presence data (name, color, cursor) |
| `join-error` | server → client | Rejection on auth or access failure |

Rate-limited to 100 messages/10s per socket, max update size 1 MB.

## Project Structure

```
├── backend/
│   └── src/
│       ├── config/          CORS, DB connection
│       ├── controllers/     Route handlers (documents, invites)
│       ├── lib/             BetterAuth instance
│       ├── middleware/      Auth, logging, error handler
│       ├── models/          Mongoose schemas (Document, InviteToken)
│       ├── routes/          Express routers
│       ├── socket/          Socket.io server with Yjs sync
│       ├── types/           Express type extensions
│       └── server.ts        Entry point
├── frontend/
│   └── src/
│       ├── components/      AuthGuard, editor (Toolbar, ShareModal, Avatars)
│       ├── hooks/           React Query hooks, useSocket
│       ├── lib/             Auth client, Axios, socket.io client
│       ├── pages/           Auth, Dashboard, Editor, Join, NotFound
│       └── types/           Shared TypeScript types
└── readme.md
```

## Build

```bash
cd backend && npm run build
cd frontend && npm run build
```
