import CandleColor from '../enums/CandleColor'

class Candle {
  currency: string
  initialDateTime: Date
  finalDateTime: Date | null
  color: CandleColor
  low: number
  high: number
  open: number
  close: number
  values: number[]

  constructor(currency: string, initialDateTime: Date = new Date()) {
    this.currency = currency
    this.initialDateTime = initialDateTime
    this.finalDateTime = null

    this.color = CandleColor.UNDETERMINED
    this.low = Infinity
    this.high = -Infinity
    this.open = 0
    this.close = 0

    this.values = []
  }

  addValue(value: number) {
    if (typeof value !== 'number' || Number.isNaN(value)) return

    this.values.push(value)

    if (this.values.length === 1) {
      this.open = value
      this.low = value
      this.high = value
      return
    }

    if (value < this.low) this.low = value
    if (value > this.high) this.high = value
  }

  closeCandle() {
    if (this.values.length === 0) return

    this.close = this.values[this.values.length - 1]
    this.finalDateTime = new Date()

    if (this.close > this.open) {
      this.color = CandleColor.GREEN
    } else if (this.close < this.open) {
      this.color = CandleColor.RED
    } else {
      this.color = CandleColor.UNDETERMINED
    }
  }

  toSimpleObject() {
    return {
      currency: this.currency,
      initialDateTime: this.initialDateTime,
      finalDateTime: this.finalDateTime,
      color: this.color,
      low: this.low,
      high: this.high,
      open: this.open,
      close: this.close,
    }
  }
}

export default Candle
