import { betterAuth } from 'better-auth'
import { mongodbAdapter } from 'better-auth/adapters/mongodb'
import { mongoClient } from '@/lib/db/mongodb'
import { connectDB } from '@/lib/db/mongodb'
import { Column } from '@/models/Column.model'

const DEFAULT_COLUMNS = [
  { name: 'Saved', color: '#6366f1', order: 0 },
  { name: 'Applying', color: '#f59e0b', order: 1 },
  { name: 'Applied', color: '#3b82f6', order: 2 },
  { name: 'Interview', color: '#8b5cf6', order: 3 },
  { name: 'Offer', color: '#10b981', order: 4 },
  { name: 'Rejected', color: '#ef4444', order: 5 },
]

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

  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          await connectDB()
          await Column.insertMany(
            DEFAULT_COLUMNS.map((col) => ({ ...col, userId: user.id })),
          )
        },
      },
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
