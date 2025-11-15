import { config } from 'dotenv'
import WebSocket from 'ws'
import Period from './enums/Period'
import Candle from './models/Candle'
import createMessageChanel from './messages/chanel'

config()

const generateCandles = async () => {
  const messageChannel = await createMessageChanel()
  if (!messageChannel) return

  console.log('Starting Candle Generator (WebSocket Mode)')

  let candle = new Candle('BTC', new Date())
  let lastMinute = new Date().getMinutes()

  const ws = new WebSocket(process.env.BINANCE_WEBSOCKET)

  ws.on('open', () => {
    console.log('Connected to Binance WebSocket')
  })

  ws.on('message', msg => {
    const data = JSON.parse(msg.toString())
    console.log('data é', data)
    const price = parseFloat(data.p)
    candle.addValue(price)

    const currentMinute = new Date().getMinutes()

    if (currentMinute !== lastMinute) {
      candle.closeCandle()
      console.log('Candle closed:', candle.toSimpleObject())

      const candleJson = JSON.stringify(candle.toSimpleObject())
      messageChannel.sendToQueue(process.env.QUEUE_NAME, Buffer.from(candleJson))
      console.log('Candle sent to queue')

      candle = new Candle('BTC', new Date())
      lastMinute = currentMinute
    }
  })

  ws.on('error', err => {
    console.error('WebSocket Error:', err)
  })

  ws.on('close', () => {
    console.log('WebSocket closed, reconnecting in 3s...')
    setTimeout(generateCandles, 3000)
  })
}

generateCandles()
