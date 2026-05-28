import type { Response, NextFunction } from 'express'
import type { AuthRequest } from '../middleware/verifyJWT.js'
import Site from '../models/Site.model.js'

const createSite = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { name, domain } = req.body as { name: string; domain: string }

    if (!name || !domain) {
      res.status(400).json({ message: 'Name and domain are required' })
      return
    }

    const existing = await Site.findOne({ domain, userId: req.userId! }).exec()
    if (existing) {
      res.status(409).json({ message: 'Site with this domain already exists' })
      return
    }

    const site = await Site.create({ name, domain, userId: req.userId! })
    res.status(201).json(site)
  } catch (err) {
    next(err)
  }
}

const getSites = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const sites = await Site.find({ userId: req.userId! }).exec()
    res.status(200).json(sites)
  } catch (err) {
    next(err)
  }
}

const getSite = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const site = await Site.findOne({
      _id: req.params.id as string,
      userId: req.userId!,
    }).exec()
    if (!site) {
      res.status(404).json({ message: 'Site not found' })
      return
    }
    res.status(200).json(site)
  } catch (err) {
    next(err)
  }
}

const updateSite = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { name, domain } = req.body as { name: string; domain: string }

    const site = await Site.findOneAndUpdate(
      { _id: req.params.id as string, userId: req.userId! },
      { name, domain },
      { new: true },
    ).exec()

    if (!site) {
      res.status(404).json({ message: 'Site not found' })
      return
    }

    res.status(200).json(site)
  } catch (err) {
    next(err)
  }
}

const deleteSite = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const site = await Site.findOneAndDelete({
      _id: req.params.id as string,
      userId: req.userId!,
    }).exec()
    if (!site) {
      res.status(404).json({ message: 'Site not found' })
      return
    }
    res.status(200).json({ message: 'Site deleted successfully' })
  } catch (err) {
    next(err)
  }
}

export { createSite, getSites, getSite, updateSite, deleteSite }
