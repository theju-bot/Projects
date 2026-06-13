import type { Request, Response } from 'express'
import { Document } from '../models/Document.model.js'

const checkOwnerShipAndGetTheDoc = async (
  req: Request,
  res: Response,
  isOwner: boolean = false,
) => {
  const doc = await Document.findById(req.params.id)
  if (!doc) {
    res.status(400).json({ error: 'Not found' })
    return
  }

  const hasAccess =
    doc.ownerId === req.user.id ||
    (!isOwner && doc.collaborators.includes(req.user.id))

  if (!hasAccess) {
    res.status(403).json({ error: 'Forbidden' })
    return
  }

  return doc
}

const getAllDocuments = async (req: Request, res: Response): Promise<void> => {
  const docs = await Document.find({
    $or: [{ ownerId: req.user.id }, { collaborators: req.user.id }],
  }).sort({ updatedAt: -1 })

  res.json(docs)
}

const createDocument = async (req: Request, res: Response): Promise<void> => {
  const count = await Document.countDocuments({ ownerId: req.user.id })

  if (count >= 3) {
    res
      .status(403)
      .json({ error: 'Document limit reached. You can only own 3 documents' })
    return
  }

  const doc = await Document.create({ ownerId: req.user.id })
  res.json(doc)
}

const getDocument = async (req: Request, res: Response): Promise<void> => {
  const doc = await checkOwnerShipAndGetTheDoc(req, res)
  if (!doc) return
  res.json(doc)
}

const updateDocument = async (req: Request, res: Response): Promise<void> => {
  const doc = await checkOwnerShipAndGetTheDoc(req, res)
  if (!doc) return

  const updated = await Document.findByIdAndUpdate(
    req.params.id,
    {
      ...req.body,
    },
    { returnDocument: 'after' },
  )

  res.json(updated)
}

const deleteDocument = async (req: Request, res: Response): Promise<void> => {
  const doc = await checkOwnerShipAndGetTheDoc(req, res, true)
  if (!doc) return

  await doc.deleteOne()
  res.json({ success: true })
}

export {
  getAllDocuments,
  createDocument,
  getDocument,
  updateDocument,
  deleteDocument,
}
