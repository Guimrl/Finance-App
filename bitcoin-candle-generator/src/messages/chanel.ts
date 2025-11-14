import { config } from 'dotenv'
import { Channel, connect } from 'amqplib'

const createMessageChanel = async (): Promise<Channel> => {
  config()

  try {
    const connection = await connect(process.env.AMQP_SERVER)
    const channel = await connection.createChannel()
    await channel.assertQueue(process.env.QUEUE_NAME)
    console.log('Connected to RabbitMQ')

    return channel
  } catch (err) {
    console.log('Error while trying to connect to RabbitMQ', err)
    return null
  }
}

export default createMessageChanel
