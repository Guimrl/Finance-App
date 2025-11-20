import { useEffect, useState } from 'react'
import ReactApexChart from 'react-apexcharts'
import axios from 'axios'
import io from 'socket.io-client'
import styled from 'styled-components'

interface Candle {
  currency: string
  finalDateTime: string
  open: number
  close: number
  high: number
  low: number
  color: string
}

const socket = io('http://localhost:3000', {
  transports: ['websocket'],
  reconnection: true,
  reconnectionAttempts: 10,
  reconnectionDelay: 2000,
})

const Container = styled('div')`
  min-height: 100vh;
  background-color: #292929;
  color: white;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
`

const DashboardWrapper = styled('div')`
  width: 100%;
  max-width: 1200px;
`

const App = () => {
  const [candles, setCandles] = useState<Candle[]>([])
  const [connected, setConnected] = useState(socket.connected)

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const response = await axios.get('http://localhost:3000/candles/30')
        const reversedData = response.data.reverse()
        setCandles(reversedData)
      } catch (err) {
        console.log('err', err)
      }
    }

    fetchInitialData()

    const onConnect = () => {
      console.log('WebSocket Connected.')
      setConnected(true)
    }

    const onDisconnect = () => {
      console.log('WebSocket Disconnected.')
      setConnected(false)
    }

    const onConnectError = (err: Error) => {
      console.log('Connection error:', err.message)
      setConnected(false)
    }

    const onNewCandle = (newCandle: Candle) => {
      console.log('New Candle Received:', newCandle)
      setCandles(prev => [...prev, newCandle])
    }

    socket.on('connect', onConnect)
    socket.on('disconnect', onDisconnect)
    socket.on('connect_error', onConnectError)
    socket.on('newCandle', onNewCandle)

    return () => {
      socket.off('connect', onConnect)
      socket.off('disconnect', onDisconnect)
      socket.off('connect_error', onConnectError)
      socket.off('newCandle', onNewCandle)
    }
  }, [])

  console.log('candles', candles)
  return (
    <Container>
      <DashboardWrapper>
        <p>{connected ? 'Conectado' : 'Desconectado'}</p>
        <ReactApexChart
          options={{
            chart: {
              type: 'candlestick',
              height: 350,
              toolbar: { show: false },
              animations: { enabled: true },
              background: 'transparent',
            },
            title: {
              text: 'Bitcoin / USD (1 Minuto)',
              align: 'left',
            },
            xaxis: {
              type: 'datetime',
              axisBorder: { color: '#374151' },
              axisTicks: { color: '#374151' },
            },
            yaxis: {
              tooltip: { enabled: true },
              labels: {
                style: { colors: '#fff', fontFamily: 'inherit' },
                formatter: value => `$${value.toFixed(2)}`,
              },
            },
            grid: {
              borderColor: '#374151',
            },
            theme: {
              mode: 'dark',
            },
            plotOptions: {
              candlestick: {
                colors: {
                  upward: '#22c55e',
                  downward: '#ef4444',
                },
              },
            },
          }}
          series={[
            {
              name: 'candle',
              data: candles.map(candle => ({
                x: new Date(candle.finalDateTime),
                y: [candle.open, candle.high, candle.low, candle.close],
              })),
            },
          ]}
          type="candlestick"
          height={500}
        />
      </DashboardWrapper>
    </Container>
  )
}

export default App
