import dayjs from 'dayjs'
import { v4 as uuid } from 'uuid'
import fsPromises from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'
import type { Request, Response, NextFunction } from 'express'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export const logEvents = async (message: string, logName: string): Promise<void> => {
  const dateTime = dayjs().format('DD MMMM YYYY\tHH:mm:ss')
  const logItem = `${dateTime}\t${uuid()}\t${message}\n`

  try {
    const logsDir = path.join(__dirname, '..', 'logs')
    const logFile = path.join(logsDir, logName)

    await fsPromises.mkdir(logsDir, { recursive: true })
    await fsPromises.appendFile(logFile, logItem)
  } catch (err) {
    console.error(err)
  }
}

export const logger = (req: Request, res: Response, next: NextFunction): void => {
  logEvents(`${req.method}\t${req.headers.origin}\t${req.url}`, 'reqLog.txt')
  console.log(`${req.method} ${req.path}`)
  next()
}