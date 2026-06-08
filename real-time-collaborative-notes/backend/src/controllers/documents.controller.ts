import type { Request, Response } from 'express'
import { Document } from '../models/Document.model.js'

const getAllDocuments = async (req: Request, res: Response): Promise<void> => {
  const docs = await Document.find({
    $or: [{ ownerId: req.user.id }, { collaborators: req.user.id }],
  }).sort({ updatedAt: -1 })

  res.json(docs)
}

export { getAllDocuments }
