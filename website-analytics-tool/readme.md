# Website Analytics Tool

A full-stack web analytics platform that allows you to track visitor behavior on your websites and view detailed analytics through a modern dashboard.

**Author:** Thesigan  
**Repository:** [github.com/theju-bot/Projects](https://github.com/theju-bot/Projects) (this app lives in the `website-analytics-tool/` directory)  

## Features

- **User Authentication**: Secure registration and login with JWT tokens (access + refresh tokens)
- **Site Management**: Add, view, update, and delete tracked websites
- **Event Tracking**: Lightweight JavaScript snippet to track page views, referrers, browser, OS, and country data
- **Analytics Dashboard**: Comprehensive analytics with visualizations including:
  - Page views over time (line chart)
  - Top pages (bar chart)
  - Traffic sources (bar chart)
  - Browser breakdown (pie chart)
  - OS breakdown (pie chart)
  - Country statistics (table)
- **Real-time Data**: Automatic data refresh with React Query
- **Responsive Design**: Mobile-friendly interface with Tailwind CSS

## Tech Stack

### Backend
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens) with httpOnly cookies
- **Password Hashing**: bcryptjs
- **CORS**: Configured for cross-origin requests
- **Logging**: Custom event logging with dayjs and uuid

### Frontend
- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite
- **State Management**: Redux Toolkit
- **Data Fetching**: TanStack React Query
- **Routing**: React Router DOM
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui (Radix UI based)
- **Charts**: Recharts
- **Forms**: React Hook Form with Zod validation
- **HTTP Client**: Axios

## Project Structure

```
website-analytics-tool/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── corsOptions.ts    # CORS configuration
│   │   │   └── dbConn.ts          # MongoDB connection
│   │   ├── controllers/
│   │   │   ├── analytics.controller.ts  # Analytics data aggregation
│   │   │   ├── auth.controller.ts       # Authentication logic
│   │   │   ├── events.controller.ts     # Event tracking
│   │   │   └── sites.controller.ts      # Site CRUD operations
│   │   ├── middleware/
│   │   │   ├── errorHandler.ts    # Global error handling
│   │   │   ├── logEvents.ts       # Request/error logging
│   │   │   └── verifyJWT.ts       # JWT verification
│   │   ├── models/
│   │   │   ├── Event.model.ts     # Event schema
│   │   │   ├── Site.model.ts      # Site schema
│   │   │   └── User.model.ts      # User schema
│   │   ├── routes/
│   │   │   ├── analytics.route.ts
│   │   │   ├── auth.route.ts
│   │   │   ├── events.route.ts
│   │   │   └── sites.route.ts
│   │   └── server.ts              # Express server setup
│   ├── package.json
│   └── tsconfig.json
└── frontend/
    ├── src/
    │   ├── api/
    │   │   └── client.ts          # Axios instance
    │   ├── components/
    │   │   └── ui/                 # shadcn/ui components
    │   ├── hooks/
    │   │   ├── useAnalytics.ts     # Analytics data fetching
    │   │   ├── useAuth.ts          # Authentication hook
    │   │   └── useSites.ts         # Site management hook
    │   ├── lib/
    │   │   └── utils.ts            # Utility functions
    │   ├── pages/
    │   │   ├── Dashboard.tsx       # Analytics dashboard
    │   │   ├── Login.tsx           # Login page
    │   │   ├── Register.tsx        # Registration page
    │   │   └── Sites.tsx           # Site management
    │   ├── store/
    │   │   ├── slices/
    │   │   │   ├── authSlice.ts    # Authentication state
    │   │   │   └── sitesSlice.ts   # Sites state
    │   │   ├── hooks.ts            # Typed Redux hooks
    │   │   └── index.ts            # Store configuration
    │   ├── types/
    │   │   └── types.ts            # TypeScript types
    │   ├── App.tsx                 # Main app with routing
    │   ├── main.tsx                # Entry point
    │   └── index.css               # Global styles
    ├── index.html
    ├── package.json
    ├── tailwind.config.js
    └── vite.config.ts
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local instance or MongoDB Atlas)
- npm or yarn

### Environment Variables

#### Backend (.env)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/website-analytics
ACCESS_TOKEN_SECRET=your_access_token_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

#### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
```

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd website-analytics-tool
```

2. **Install backend dependencies**
```bash
cd backend
npm install
```

3. **Install frontend dependencies**
```bash
cd ../frontend
npm install
```

### Running the Application

1. **Start MongoDB**
   - Make sure MongoDB is running on your system or update the `MONGODB_URI` in the backend `.env` file

2. **Start the backend server**
```bash
cd backend
npm run dev
```
The backend will run on `http://localhost:5000`

3. **Start the frontend development server**
```bash
cd frontend
npm run dev
```
The frontend will run on `http://localhost:5173`

### Building for Production

**Backend:**
```bash
cd backend
npm run build
npm start
```

**Frontend:**
```bash
cd frontend
npm run build
npm run preview
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - Logout user

### Sites
- `GET /api/sites` - Get all user sites
- `POST /api/sites` - Create a new site
- `GET /api/sites/:id` - Get a specific site
- `PUT /api/sites/:id` - Update a site
- `DELETE /api/sites/:id` - Delete a site

### Events
- `POST /api/events` - Track an event (public endpoint)

### Analytics
- `GET /api/analytics/:siteId/pageViews` - Get page views over time
- `GET /api/analytics/:siteId/topPages` - Get top pages
- `GET /api/analytics/:siteId/sources` - Get traffic sources
- `GET /api/analytics/:siteId/browsers` - Get browser statistics
- `GET /api/analytics/:siteId/os` - Get OS statistics
- `GET /api/analytics/:siteId/countries` - Get country statistics

## Usage

1. **Register an account**: Navigate to `/register` and create an account
2. **Login**: Use your credentials to login at `/login`
3. **Add a site**: Go to `/sites` and add your website by providing a name and domain
4. **Get tracking script**: Click "Get Script" on your site card to get the JavaScript tracking snippet
5. **Add script to your website**: Paste the tracking script in the `<head>` section of your website
6. **View analytics**: Click on your site card to view the analytics dashboard

## Tracking Script

The tracking script automatically collects:
- Page path
- Referrer URL
- Browser type (Chrome, Firefox, Safari, Edge)
- Operating system (Windows, macOS, Linux, Android, iOS)
- Country (if available)

The script is lightweight and runs asynchronously to avoid impacting your website's performance.

## Security Features

- Password hashing with bcryptjs
- JWT authentication with httpOnly cookies
- CSRF protection via sameSite cookie settings
- CORS configuration for cross-origin requests
- Route protection with JWT verification middleware
- Site ownership verification for analytics access

## License

MIT