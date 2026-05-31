# Backend

Express.js server with TypeScript for the Website Analytics Tool.

**Author:** Thesigan  
**Repository:** [github.com/theju-bot/Projects](https://github.com/theju-bot/Projects) (this app lives in the `website-analytics-tool/` directory)

## Features

- RESTful API with Express.js
- JWT authentication with access/refresh tokens
- MongoDB integration with Mongoose
- Event tracking endpoint
- Analytics data aggregation
- CORS configuration
- Request/error logging

## Tech Stack

- Node.js with TypeScript
- Express.js
- MongoDB with Mongoose
- JWT (jsonwebtoken)
- bcryptjs for password hashing
- dayjs for date formatting

## Installation

```bash
npm install
```

## Environment Variables

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/website-analytics
ACCESS_TOKEN_SECRET=your_access_token_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

## Running

```bash
npm run dev
```

## Building

```bash
npm run build
npm start
```

## License

MIT
