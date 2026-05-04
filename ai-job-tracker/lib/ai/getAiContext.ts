import { AppError } from '@/lib/errors/AppError'
import { mongoClient } from '@/lib/db/mongodb'
import CryptoJS from 'crypto-js'

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY!
export const DEFAULT_MODEL = 'operouter/free'

export async function getAiContext(userId: string) {
  const db = mongoClient.db()
  const user = await db.collection('user').findOne({ id: userId })

  if (!user?.openRouterKey) {
    throw new AppError(
      'OpenRouter key not configured',
      400,
      'OPENROUTER_KEY_MISSING',
    )
  }

  const apiKey = CryptoJS.AES.decrypt(
    user.openRouterKey,
    ENCRYPTION_KEY,
  ).toString(CryptoJS.enc.Utf8)

  return {
    apiKey,
    model: (user.preferredModel || DEFAULT_MODEL) as string,
    profile: {
      targetRole: (user.targetRole ?? '') as string,
      skills: (user.skills ?? []) as string[],
      yearsOfExperience: (user.yearsOfExperience ?? 0) as number,
      bio: (user.bio ?? '') as string,
    },
  }
}
