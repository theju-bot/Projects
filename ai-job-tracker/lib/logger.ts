import fs from 'fs'
import path from 'path'

const LOG_DIR = path.join(process.cwd(), 'logs')
const REQUEST_LOG = path.join(LOG_DIR, 'requests.log')
const ERROR_LOG = path.join(LOG_DIR, 'errors.log')

function ensureLogDir() {
  if (!fs.existsSync(LOG_DIR)) {
    fs.mkdirSync(LOG_DIR, { recursive: true })
  }
}

function timestamp(): string {
  const now = new Date()
  const date = now.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
  const time = now.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  })
  return `${date} ${time}`
}

function prependToFile(filePath: string, content: string) {
  try {
    ensureLogDir()
    const existing = fs.existsSync(filePath)
      ? fs.readFileSync(filePath, 'utf-8')
      : ''
    fs.writeFileSync(filePath, content + '\n' + existing)
  } catch (err) {
    console.error(`[Logger] Failed to write to ${filePath}:`, err)
  }
}

export const logger = {
  request(method: string, path: string, status: number, durationMs: number) {
    const line = `[${timestamp()}] ${method} ${path} → ${status} (${durationMs}ms)`
    prependToFile(REQUEST_LOG, line)
  },

  error(
    method: string,
    path: string,
    status: number,
    durationMs: number,
    error: {
      code?: string
      message: string
      stack?: string
    },
  ) {
    const lines = [
      `[${timestamp()}] ${method} ${path} → ${status} (${durationMs}ms)`,
      `  Code: ${error.code ?? 'UNKNOWN'}`,
      `  Message: ${error.message}`,
    ]

    if (process.env.NODE_ENV === 'development' && error.stack) {
      lines.push(`  Stack: ${error.stack}`)
    }

    prependToFile(ERROR_LOG, lines.join('\n'))
  },
}
