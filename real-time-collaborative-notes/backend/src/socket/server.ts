import { IncomingMessage, Server, ServerResponse } from 'node:http'
import { WebSocketServer } from 'ws'
// @ts-ignore
import { setupWSConnection } from 'y-websocket/bin/utils'

export const setupWebsocketServer = (
  httpServer: Server<typeof IncomingMessage, typeof ServerResponse>,
) => {
  const wss = new WebSocketServer({
    server: httpServer,
    path: '/collaboration',
  })

  wss.on('connection', (ws, req) => {
    setupWSConnection(ws, req)
  })

  console.log('WebSocket server ready at /collaboration')
}
