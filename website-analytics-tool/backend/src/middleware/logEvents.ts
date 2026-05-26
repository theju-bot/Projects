import dayjs from 'dayjs'
import { v4 as uuid } from 'uuid'
import fs from 'fs'
import fsPromises from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'
import type { Request, Response, NextFunction } from 'express'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const logEvents = async (message: string, logName: string): Promise<void> => {
  const dateTime = dayjs().format('DD MMMM YYYY\tHH:mm:ss')
  const logItem = `${dateTime}\t${uuid()}\t${message}\n`

  try {
    const logsDir = path.join(__dirname, '..', 'logs')
    const logFile = path.join(logsDir, logName)

    if (!fs.existsSync(logsDir)) {
      await fsPromises.mkdir(logsDir)
    }

    let existingLogs = ''

    if (fs.existsSync(logFile)) {
      existingLogs = await fsPromises.readFile(logFile, 'utf8')
    }

    await fsPromises.writeFile(logFile, logItem + existingLogs)
  } catch (err) {
    console.error(err)
  }
}

const logger = (req: Request, res: Response, next: NextFunction): void => {
  logEvents(`${req.method}\t${req.headers.origin}\t${req.url}`, 'reqLog.txt')
  console.log(`${req.method} ${req.path}`)
  next()
}

export { logger, logEvents }
