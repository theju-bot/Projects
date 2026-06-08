import type { Request, Response } from 'express'
import { v4 as uuid } from 'uuid'
import { Document } from '../models/Document.model.js'
import { InviteToken } from '../models/InviteToken.model.js'

const generateInvite = async (req: Request, res: Response): Promise<void> => {
  const doc = await Document.findById(req.params.id)
  if (!doc) {
    res.status(404).json({ error: 'Not found' })
    return
  }
  if (doc.ownerId !== req.user.id) {
    res.status(403).json({ error: 'Forbidden' })
    return
  }

  const token = uuid()
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000)

  await InviteToken.create({ token, documentId: doc._id, expiresAt })

  res.json({ token })
}

const acceptInvite = async (req: Request, res: Response): Promise<void> => {
  const invite = await InviteToken.findOne({ token: req.params.token! })

  if (!invite || invite.used || invite.expiresAt < new Date()) {
    res.status(400).json({ error: 'Invalid or expired token' })
    return
  }

  await Document.findByIdAndUpdate(invite.documentId, {
    $addToSet: { collaborators: req.user.id },
  })

  invite.used = true
  await invite.save()
}

export { generateInvite, acceptInvite }
