const amqp = require("amqplib/callback_api");

amqp.connect("amqp://ti_rabbitmq", function (error0, connection) {
  if (error0) {
    throw error0;
  }

  connection.createChannel((err, channel) => {
    if (err) {
      throw err;
    }

    console.log('Channel established ... \n');

    const queue = 'ti.rpc.worker';
    const exchange = "bpmn.rpc";
    const routingKey = 'rpc.request'

    channel.assertExchange(exchange, "topic", {
      durable: true, autoDelete: true
    });

    channel.assertQueue(queue, { durable: true}, (error_1)=> {
      if(error_1) {
        throw error_1;
      }

      channel.bindQueue(queue, exchange, routingKey);
    
      channel.consume(queue, (msg)=> {
        const replyTo = msg.properties.replyTo;
        console.log("replying to -> ", replyTo)
        
        const content = Buffer.from(JSON.stringify(msg.content));
        channel.sendToQueue(replyTo, content, {
          correlationId: msg.properties.correlationId,
          persistent: true
        });
      }, {noAck: true})
    });
  });
});
