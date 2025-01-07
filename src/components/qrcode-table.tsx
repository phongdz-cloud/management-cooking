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
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    canvas.height = width + 70
    canvas.width = width
    const canvasContext = canvas.getContext('2d')
    if (!canvasContext) return
    canvasContext.fillStyle = '#fff'
    canvasContext.fillRect(0, 0, canvas.width, canvas.height)
    canvasContext.font = '20px Arial'
    canvasContext.textAlign = 'center'
    canvasContext.fillStyle = '#000'
    canvasContext.fillText(
      `Bàn số ${tableNumber}`,
      canvas.width / 2,
      canvas.width + 20
    )
    canvasContext.fillText(
      `Quét mã QR để gọi món`,
      canvas.width / 2,
      canvas.width + 50
    )

    const virtalCanvas = document.createElement('canvas')
    QRCode.toCanvas(
      virtalCanvas,
      getTableLink({
        token,
        tableNumber,
      }),
      (error) => {
        if (error) {
          console.log(error)
        } else {
          canvasContext.drawImage(virtalCanvas, 0, 0, width, width)
        }
      }
    )
  }, [token, tableNumber, canvasRef.current])
  return <canvas ref={canvasRef} />
}

export default QRCodeTable
