import type { Request, Response, NextFunction } from 'express'
import Event from '../models/Event.model.js'
import mongoose from 'mongoose'

export const trackEvent = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { siteId, type, path, referrer, browser, os, country } = req.body as {
      siteId: string
      type: string
      path: string
      referrer: string
      browser: string
      os: string
      country: string
    }

    if (!siteId || !type || !path) {
      res.status(400).json({ message: 'siteId, type and path are required' })
      return
    }

    await Event.create({
      siteId: new mongoose.Types.ObjectId(siteId),
      type,
      path,
      referrer: referrer,
      browser: browser,
      os: os,
      country: country,
    })

    res.status(201).json({ message: 'Event tracked' })
  } catch (err) {
    next(err)
  }
}
