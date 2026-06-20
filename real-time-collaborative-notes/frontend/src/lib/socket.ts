import { io } from 'socket.io-client'

const isDev = import.meta.env.MODE === 'development'

const socket = io(import.meta.env.VITE_SERVER_URL, {
  path: isDev ? '/socket.io' : '/noteflow/socket.io',
  withCredentials: true,
  autoConnect: false,
})

export default socket
