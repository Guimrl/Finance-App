import { useEffect, useState } from 'react'
import ReactApexChart from 'react-apexcharts'
import axios from 'axios'
import io from 'socket.io-client'
import type { Candle } from './Interfaces/Candles'
import {
  ChartCard,
  Container,
  DashboardWrapper,
  Header,
  IconWrapper,
  LoadingState,
  StatCard,
  StatsGrid,
  StatusIndicator,
  StatValue,
  Title,
  TitleGroup,
} from './Components'
import type { ApexOptions } from 'apexcharts'

const socket = io('http://localhost:3000', {
  transports: ['websocket'],
  reconnection: true,
  reconnectionAttempts: 10,
  reconnectionDelay: 2000,
})

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

  const getLastPrice = () => (candles.length > 0 ? candles[candles.length - 1].close : 0)
  const getFirstPrice = () => (candles.length > 0 ? candles[0].close : 0)
  const isTrendUp = getLastPrice() > getFirstPrice()

  const options: ApexOptions = {
    chart: {
      type: 'candlestick',
      height: 350,
      toolbar: { show: false },
      animations: { enabled: true },
      background: 'transparent',
      fontFamily: 'inherit',
    },
    title: {
      text: 'Bitcoin / USD (1 Minuto)',
      align: 'left',
      style: { color: '#fff', fontFamily: 'inherit' },
    },
    xaxis: {
      type: 'datetime',
      labels: { style: { colors: '#fff', fontFamily: 'inherit' } },
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
  }

  const series = [
    {
      name: 'candle',
      data: candles.map(candle => ({
        x: new Date(candle.finalDateTime),
        y: [candle.open, candle.high, candle.low, candle.close],
      })),
    },
  ]

  console.log('candles', candles)
  return (
    <Container>
      <DashboardWrapper>
        <Header>
          <TitleGroup>
            <IconWrapper>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                />
              </svg>
            </IconWrapper>
            <Title>Crypto Dashboard</Title>
          </TitleGroup>

          <StatusIndicator $connected={connected}>
            <span className="dot"></span>
            <span className="text">{connected ? 'Conectado em Tempo Real' : 'Desconectado'}</span>
          </StatusIndicator>
        </Header>
        <ChartCard>
          {candles.length > 0 ? (
            <ReactApexChart options={options} series={series} type="candlestick" height={500} />
          ) : (
            <LoadingState>Carregando dados do mercado...</LoadingState>
          )}
        </ChartCard>
        <StatsGrid>
          <StatCard>
            <h3>Último Preço</h3>
            <StatValue>
              {candles.length > 0 ? `$${candles[candles.length - 1].close.toFixed(2)}` : '---'}
            </StatValue>
          </StatCard>

          <StatCard>
            <h3>Tendência (30 min)</h3>
            <StatValue
              $color={candles.length > 0 ? (isTrendUp ? '#22c55e' : '#ef4444') : undefined}
            >
              {candles.length > 0 ? (isTrendUp ? 'Alta ↗' : 'Baixa ↘') : '---'}
            </StatValue>
          </StatCard>

          <StatCard>
            <h3>Par</h3>
            <StatValue $color="#eab308">BTC / USD</StatValue>
          </StatCard>
        </StatsGrid>
      </DashboardWrapper>
    </Container>
  )
}

export default App
