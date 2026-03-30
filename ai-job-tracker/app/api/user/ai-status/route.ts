import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { mongoClient } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

export async function GET(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers })
  if (!session)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const db = mongoClient.db()
  const user = await db
    .collection('user')
    .findOne(
      { _id: new ObjectId(session.user.id) },
      { projection: { aiProvider: 1, apiKey: 1 } },
    )

  return NextResponse.json({
    hasKey: !!user?.apiKey,
    provider: user?.aiProvider || null,
  })
}
