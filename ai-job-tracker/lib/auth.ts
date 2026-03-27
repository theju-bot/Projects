import { betterAuth } from 'better-auth'
import { mongodbAdapter } from 'better-auth/adapters/mongodb'
import { mongoClient } from './mongodb'

export const auth = betterAuth({
  database: mongodbAdapter(mongoClient.db()),
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },
  secret: process.env.BETTER_AUTH_SECRET!,
  baseURL: process.env.BETTER_AUTH_URL!,
  user: {
    additionalFields: {
      aiProvider: {
        type: 'string',
        defaultValue: '',
        input: true,
      },
      apiKey: {
        type: 'string',
        defaultValue: '',
        input: true,
        select: false,
      },
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 3,
    updateAge: 60 * 60 * 24,
  },
})
