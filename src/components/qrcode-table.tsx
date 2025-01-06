'use client'
import { getTableLink } from '@/lib/utils'
import QRCode from 'qrcode'
import { useEffect, useRef } from 'react'

const QRCodeTable = ({
  token,
  tableNumber,
  width = 250,
}: {
  token: string
  tableNumber: number
  width?: number
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    if (canvasRef.current) {
      QRCode.toCanvas(
        canvasRef.current,
        getTableLink({
          token,
          tableNumber,
        }),
        (error) => {
          if (error) {
            console.error(error)
          }
        }
      )
    }
  }, [token, tableNumber, canvasRef.current])
  return <canvas ref={canvasRef} />
}

export default QRCodeTable
