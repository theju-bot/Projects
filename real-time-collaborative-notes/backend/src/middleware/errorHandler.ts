import { logEvents } from './logEvents.js'
import type { Request, Response, NextFunction } from 'express'

const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  logEvents(`${err.name}: ${err.message}`, 'errLog.txt')
  console.error(err.stack)
  res.status(500).send(err.message)
}

export default errorHandler
