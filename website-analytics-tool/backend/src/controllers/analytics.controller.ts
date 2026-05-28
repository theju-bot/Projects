import type { Response, NextFunction } from 'express'
import type { AuthRequest } from '../middleware/verifyJWT.js'
import mongoose from 'mongoose'
import Event from '../models/Event.model.js'
import Site from '../models/Site.model.js'
import { count } from 'console'

const verifySiteOwnership = async (
  siteId: string,
  userId: mongoose.Types.ObjectId,
): Promise<boolean> => {
  const site = await Site.findOne({ _id: siteId, userId }).exec()
  return !!site
}

const checkOwnership = async (
  req: AuthRequest,
  res: Response,
): Promise<string | null> => {
  const siteId = req.params.siteId as string
  const owned = await verifySiteOwnership(siteId, req.userId!)

  if (!owned) {
    res.status(403).json({ message: 'Forbidden' })
    return null
  }

  return siteId
}

const getPageViews = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const siteId = await checkOwnership(req, res)
    if (!siteId) return

    const data = await Event.aggregate([
      { $match: { siteId: new mongoose.Types.ObjectId(siteId) } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
      { $project: { _id: 0, date: '$_id', count: 1 } },
    ])

    res.status(200).json(data)
  } catch (err) {
    next(err)
  }
}

const getTopPages = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const siteId = await checkOwnership(req, res)
    if (!siteId) return

    const data = await Event.aggregate([
      { $match: { siteId: new mongoose.Types.ObjectId(siteId) } },
      {
        $group: {
          _id: '$path',
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 10 },
      { $project: { _id: 0, path: '$_id', count: 1 } },
    ])

    res.status(200).json(data)
  } catch (err) {
    next(err)
  }
}

const getTrafficSources = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const siteId = await checkOwnership(req, res)
    if (!siteId) return

    const data = await Event.aggregate([
      { $match: { siteId: new mongoose.Types.ObjectId(siteId) } },
      {
        $group: {
          _id: '$referrer',
          count: { $sum: 1 },
        },
      },
      { $sort: { $count: -1 } },
      { $limit: 10 },
      { $project: { _id: 0, referrer: '$_id', count: 1 } },
    ])

    res.status(200).json(data)
  } catch (err) {
    next(err)
  }
}

const getBrowserStats = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const siteId = await checkOwnership(req, res)
    if (!siteId) return

    const data = await Event.aggregate([
      { $match: { siteId: new mongoose.Types.ObjectId(siteId) } },
      {
        $group: {
          _id: 'browser',
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $project: { _id: 0, browser: '$_id', count: 1 } },
    ])

    res.status(200).json(data)
  } catch (err) {
    next(err)
  }
}

const getOSStats = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const siteId = await checkOwnership(req, res)
    if (!siteId) return

    const data = await Event.aggregate([
      { $match: { siteId: new mongoose.Types.ObjectId(siteId) } },
      {
        $group: {
          _id: '$os',
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $project: { _id: 0, os: '$_id', count: 1 } },
    ])

    res.status(200).json(data)
  } catch (err) {
    next(err)
  }
}

const getCountryStats = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const siteId = await checkOwnership(req, res)
    if (!siteId) return

    const data = await Event.aggregate([
      { $match: { siteId: new mongoose.Types.ObjectId(siteId) } },
      {
        $group: {
          _id: '$country',
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $project: { _id: 0, country: '$_id', count: 1 } },
    ])

    res.status(200).json(data)
  } catch (err) {
    next(err)
  }
}

export {
  getPageViews,
  getTopPages,
  getTrafficSources,
  getBrowserStats,
  getOSStats,
  getCountryStats,
}
