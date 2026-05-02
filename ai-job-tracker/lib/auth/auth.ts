import { betterAuth } from 'better-auth'
import { mongodbAdapter } from 'better-auth/adapters/mongodb'
import { mongoClient } from '@/lib/db/mongodb'

export const auth = betterAuth({
  database: mongodbAdapter(mongoClient.db()),

  emailAndPassword: {
    enabled: true,
  },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },

  user: {
    additionalFields: {
      targetRole: {
        type: 'string',
        defaultValue: '',
      },
      skills: {
        type: 'string[]',
        defaultValue: [],
      },
      yearsOfExperience: {
        type: 'number',
        defaultValue: 0,
      },
      bio: {
        type: 'string',
        defaultValue: '',
      },
      preferredModel: {
        type: 'string',
        defaultValue: '',
      },
      openRouterKey: {
        type: 'string',
        defaultValue: '',
        returned: false,
      },
    },
  },

  session: { expiresIn: 60 * 60 * 24 * 3, updateAge: 60 * 60 * 24 },

  secret: process.env.BETTER_AUTH_SECRET!,
  baseURL: process.env.BETTER_AUTH_URL!,
})
