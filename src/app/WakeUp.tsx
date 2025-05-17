'use client'

import { useEffect } from 'react'
import { io } from 'socket.io-client'

export default function WakeUp({
  children,
}: {
  children: React.ReactNode
}) {
  useEffect(() => {
    // 1) HTTP “wake” ping
    fetch(`${process.env.NEXT_PUBLIC_SOCKET_URL}/`)
      .catch(() => {})

    // 2) Optional quick socket.io handshake
    const sock = io(process.env.NEXT_PUBLIC_SOCKET_URL, {
      autoConnect: true,
      reconnection: false,
    })
    sock.on('connect', () => sock.disconnect())
  }, [])

  return <>{children}</>
}
