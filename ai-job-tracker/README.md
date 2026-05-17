# AI Job Tracker

AI Job Tracker is an advanced web application that empowers users to organize, visualize, and optimize their job search. Leveraging a Kanban board UI, analytics dashboards, and AI-powered tools, it brings structure and insights to the application process.

---

## ✨ Features

- **Kanban Board:**  
  Easily add, edit, and organize job applications by phases such as Applied, Interviewing, Offer, Rejected, etc. Drag and drop to move applications between stages.

- **AI Assistance:**  
  Integrate with OpenRouter or OpenAI for:
  - Resume/CV feedback
  - Job description & requirements parsing
  - Personalized application suggestions
  - Automated form filling

- **Analytics Dashboard:**  
  Track interview stats, offers, response rates, and visualize trends over time.

- **User Authentication:**  
  Secure sign-up, login, token/session-based authentication.

- **Customizable Settings:**  
  Light/dark mode, notification settings, AI provider selection, user profile editing.

- **Mobile-Friendly:**  
  Responsive design for seamless use on desktop/tablet/mobile.

---

## 🔥 Demo

_Screenshots and video demos go here. Add your screenshots to `/public/` and link them as shown:_

```md
![Kanban Board UI](public/screenshot-kanban.png)
![Analytics Dashboard](public/screenshot-analytics.png)
```

<details>
<summary>Click for animated demo</summary>

[![Watch video](public/demo-thumb.png)](link-to-demo-video)
</details>

---

## 🏗️ Technology Stack

- **Frontend:** Next.js (React), TypeScript, CSS Modules
- **Backend:** Next.js API routes, MongoDB (via Mongoose/Native)
- **Authentication:** Custom implementation (see `lib/auth`)
- **State Management:** React context/hooks, Zustand (if used)
- **AI Providers:** OpenAI/OpenRouter (configurable)
- **UI Components:** Custom, modular, and extensible

---

## 📦 Directory Structure

```text
app/            # Next.js app routes, pages, API
components/     # Modular and feature-specific UI components
hooks/          # Custom React hooks (e.g., useSettings, useJobs)
lib/            # Utilities, validation, DB, AI helpers
models/         # Database models (e.g., Job, Column)
store/          # State management config and slices
types/          # TypeScript type definitions
public/         # Static files (add images here)
logs/           # (optional) Logs collection
```

---

## ⚙️ Setup & Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/theju-bot/Projects.git
   cd Projects/ai-job-tracker
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Copy and set environment variables:**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and fill out:

| Variable Name                 | Purpose                                     | Example Value                                   |
|-------------------------------|---------------------------------------------|--------------------------------------------------|
| `MONGODB_URI`                 | Connection string for your MongoDB          | `mongodb://localhost:27017/mydb`                |
| `BETTER_AUTH_SECRET`          | Secret for auth session/token encryption    | `your-super-secret-key`                         |
| `BETTER_AUTH_URL`             | URL of your BetterAuth service (internal)   | `http://localhost:4000`                         |
| `NEXT_PUBLIC_BETTER_AUTH_URL` | Public BetterAuth service URL (frontend)    | `http://localhost:4000`                         |
| `GOOGLE_CLIENT_ID`            | Google OAuth Client ID for login            | `123456789-xxxxx.apps.googleusercontent.com`    |
| `GOOGLE_CLIENT_SECRET`        | Google OAuth Client Secret                  | `super-google-secret`                           |
| `ENCRYPTION_KEY`              | Key for encryption routines                 | `16+ character string`                          |

> **ℹ️ All variables are mandatory — the app will not run or deploy without all of them defined correctly!**


4. **Run the application:**
   ```bash
   npm run dev
   ```

   Visit [http://localhost:3000](http://localhost:3000) to start using the app.

---

## 🪄 AI Features

- **Configuration:**  
  You can switch between AI providers or disable AI features in user settings (`components/settings`).
- **Custom prompts:**  
  Edit or extend AI prompt logic in `lib/ai/prompts/` as desired.

---

## 🤖 API Routes

All API endpoints are found in `app/api/`.  
Key routes include:

- `/api/jobs/`: CRUD for job applications
- `/api/ai/`: AI-powered suggestions and parsing
- `/api/columns/`: Manage Kanban columns
- `/api/auth/`: Authentication endpoints
- `/api/user/`: User settings and profile management
- `/api/log/`: (Optional) Application logs

---

## 🛠️ Common Issues / FAQ

- **App won’t boot?**  
  Double-check your environment variables in `.env`.

- **Can’t connect to MongoDB?**  
  Make sure your db is up and accessible from your network.

- **AI features not working?**  
  Ensure valid API keys for OpenRouter/OpenAI; check usage settings.

---

## 📝 License

MIT
