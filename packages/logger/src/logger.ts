import pino from 'pino'

export interface LoggerContext {
  requestId?: string
  correlationId?: string
  traceId?: string
  userId?: string
  tenantId?: string
}

const transport = pino.transport({
  target: 'pino-pretty',
  options: {
    colorize: true,
    translateTime: 'SYS:standard',
    ignore: 'pid,hostname',
  },
})

export function createLogger(context: LoggerContext = {}): pino.Logger {
  return pino(
    {
      level: process.env.LOG_LEVEL || 'info',
      base: context,
    },
    transport,
  )
}

export const logger = createLogger()
