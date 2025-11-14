import CandleColor from '../enums/CandleColor'

class Candle {
  currency: string
  initialDateTime: Date
  finalDateTime: Date
  color: CandleColor
  low: number
  high: number
  open: number
  close: number
  values: Array<number>

  constructor(currency: string, initialDateTime: Date) {
    this.currency = currency
    this.initialDateTime = initialDateTime
    this.color = CandleColor.UNDETERMINED
    this.low = Infinity
    this.high = 0
    this.open = 0
    this.close = 0
    this.values = []
  }

  addValue(value: number) {
    this.values.push(value)

    if (this.values.length == 1) {
      this.open = value
    }

    if (this.low > value) {
      this.low = value
    }

    if (this.high < value) {
      this.high = value
    }
  }

  closeCandle() {
    if (this.values.length > 0) {
      this.close = this.values[this.values.length - 1]
      this.finalDateTime = new Date()

      if (this.open > this.close) {
        this.color = CandleColor.RED
      } else if (this.close > this.open) {
        this.color = CandleColor.GREEN
      }
    }
  }

  toSimpleObject() {
    const { values, ...rest } = this
    return rest
  }
}

export default Candle
