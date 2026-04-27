import { NextRequest, NextResponse } from 'next/server'
import { requireSession } from '@/lib/auth/getSession'
import { withErrorHandler } from '@/lib/errors/errorHandler'
import { AppError } from '@/lib/errors/AppError'
import { saveApiKeySchema } from '@/lib/validations/user.schema'
import { mongoClient } from '@/lib/db/mongodb'
import CryptoJS from 'crypto-js'

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY!

function encryptKey(key: string): string {
  return CryptoJS.AES.encrypt(key, ENCRYPTION_KEY).toString()
}

export const POST = withErrorHandler(async (req: NextRequest) => {
  const session = await requireSession(req)

  const body = await req.json()
  const { openRouterKey } = saveApiKeySchema.parse(body)

  if (!ENCRYPTION_KEY)
    throw new AppError('Encryption key not configured', 500, 'INTERNAL_ERROR')

  const encrypted = encryptKey(openRouterKey)

  const db = mongoClient.db()
  await db
    .collection('user')
    .updateOne({ id: session.user.id }, { $set: { openRouterKey: encrypted } })

  return NextResponse.json({ success: true, message: 'API key saved' })
})

export const DELETE = withErrorHandler(async (req: NextRequest) => {
  const session = await requireSession(req)

  const db = mongoClient.db()
  await db.collection('user').updateOne(
    {
      id: session.user.id,
    },
    { $unset: { openRouterKey: '' } },
  )

  return NextResponse.json({ success: true, message: 'API key removed' })
})
