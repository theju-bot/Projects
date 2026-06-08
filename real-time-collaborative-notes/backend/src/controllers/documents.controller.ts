import type { Request, Response } from 'express'
import { Document } from '../models/Document.model.js'

const getAllDocuments = async (req: Request, res: Response): Promise<void> => {
  const docs = await Document.find({
    $or: [{ ownerId: req.user.id }, { collaborators: req.user.id }],
  }).sort({ updatedAt: -1 })

  res.json(docs)
}

const createDocument = async (req: Request, res: Response): Promise<void> => {
  const doc = await Document.create({ ownerId: req.user.id })
  res.json(doc)
}

const getDocument = async (req: Request, res: Response): Promise<void> => {
  const doc = await Document.findById(req.params.id)
  if (!doc) {
    res.status(400).json({ error: 'Not found' })
    return
  }

  const hasAccess =
    doc.ownerId === req.user.id || doc.collaborators.includes(req.user.id)

  if (!hasAccess) {
    res.status(403).json({ error: 'Forbidden' })
    return
  }

  res.json(doc)
}

const updateDocument = async (req: Request, res: Response): Promise<void> => {
  const doc = await Document.findByIdAndUpdate(
    req.params.id,
    {
      ...req.body,
    },
    { new: true },
  )

  res.json(doc)
}

const deleteDocument = async (req: Request, res: Response): Promise<void> => {
  const doc = await Document.findById(req.params.id)
  if (!doc) {
    res.status(404).json({ error: 'Not found' })
    return
  }
  if (doc.ownerId !== req.user.id) {
    res.status(403).json({ error: 'Forbidden' })
  }

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
