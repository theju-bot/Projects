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
        input: false,
      },
      skills: {
        type: 'string[]',
        defaultValue: [],
        input: false,
      },
      yearsOfExperience: {
        type: 'number',
        defaultValue: 0,
        input: false,
      },
      bio: {
        type: 'string',
        defaultValue: '',
        input: false,
      },
      preferredModel: {
        type: 'string',
        defaultValue: '',
        input: false,
      },
      openRouterKey: {
        type: 'string',
        defaultValue: '',
        input: true,
        returned: false,
      },
    },
  },

  session: { expiresIn: 60 * 60 * 24 * 3, updateAge: 60 * 60 * 24 },

  secret: process.env.BETTER_AUTH_SECRET!,
  baseURL: process.env.BETTER_AUTH_URL!,
})
